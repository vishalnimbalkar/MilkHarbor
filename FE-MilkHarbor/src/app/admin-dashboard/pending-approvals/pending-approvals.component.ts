import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { AdminServiceService } from 'src/app/services/admin-service';

@Component({
  selector: 'app-pending-approvals',
  templateUrl: './pending-approvals.component.html',
  styleUrls: ['./pending-approvals.component.css']
})
export class PendingApprovalsComponent implements OnInit{

  PendingFarmers:any[]=[];
  selectAll: boolean = false;
  keyValueMap: { [key: string]: string } = {};
  isLoading:boolean=false;

  ngOnInit(): void {
    this.getPendingFarmers();
  }

  constructor(private adminService:AdminServiceService,private toast: NgToastService){}

  getPendingFarmers(){
    this.adminService.getPendingFarmers().subscribe((response:any)=>{
      this.PendingFarmers = response?.map((obj: any) => ({ ...obj, isActive: false }));
    })
  }

 //add value in keyValueMap
 addValue(id: string) {
  this.keyValueMap[id] = "APPROVED";
}

//delete value in keyValueMap
deleteValue(id: string) {
  delete this.keyValueMap[id];
}

//get size of keyValueMap
getSize(): number {
  return Object.keys(this.keyValueMap).length;
}

onChangePendingFarmers(event: any) {
  const id = event.target.value;
  const checked = event.target.checked;

  this.PendingFarmers = this.PendingFarmers.map((d: any) => {

    if (d._id == id) {
      d.isActive = checked;
      this.selectAll = false;

      if (d.isActive) {
        this.addValue(d._id);
      } else {
        this.deleteValue(id);
      }

      return d;
    }

    //logic for selectAll and also add all data
    if (id == -1 && event.target.checked == true) {
      d.isActive = this.selectAll;
      this.addValue(d._id);
    }

    //logic for deselectAll and also clear all data
    if (id == -1 && event.target.checked == false) {
      d.isActive = this.selectAll;
      this.keyValueMap = this.keyValueMap = {};
    }

    return d;
  })

  //when we check all checkboxes one by one then selectAll checkbox also checked
  if (this.getSize() == this.PendingFarmers.length) {
    this.selectAll = true;
  }
}

onApprove(){
  this.isLoading = true
  this.selectAll=false
  for (const id of Object.keys(this.keyValueMap)) {
    this.keyValueMap[id] = "APPROVED";
  }
  
  this.adminService.onApprove(this.keyValueMap).subscribe((response:any) => {
    if(response==true){
      this.getPendingFarmers()
      this.toast.success({ detail: "SUCCESS", summary: 'Approved successfully', duration: 5000, position: 'topRight' });
      this.keyValueMap = {};
      this.isLoading = false
    } else {
      this.toast.error({ detail: "Error! please try again!", summary: 'Failed to Approve', duration: 5000, position: 'topRight' });
      this.isLoading = false
    }
  })
}



onDecline(){
  this.isLoading = true
  this.selectAll=false
  for (const id of Object.keys(this.keyValueMap)) {
    this.keyValueMap[id] = "DECLINE";
  }
  this.adminService.onDecline(this.keyValueMap).subscribe((response:any) => {
    if(response==true){
      this.getPendingFarmers()
      this.toast.success({ detail: "SUCCESS", summary: 'Declined successfully', duration: 5000, position: 'topRight' });
      this.keyValueMap = {};
      this.isLoading = false
    } else {
      this.toast.error({ detail: "Error! please try again!", summary: 'Failed to Decline', duration: 5000, position: 'topRight' });
      this.isLoading = false
    }
  })
}
}
