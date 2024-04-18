import { Component, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { AdminServiceService } from 'src/app/services/admin-service';

@Component({
  selector: 'app-farmer-list',
  templateUrl: './farmer-list.component.html',
  styleUrls: ['./farmer-list.component.css']
})
export class FarmerListComponent implements OnInit {

  FarmersList: any[] = [];
  selectAll: boolean = false;
  keyValueMap: { [key: string]: string } = {};
  isLoading: boolean = false;
  searchQuery: string = ''
  items:any[]=[];

  ngOnInit(): void {
    this.getFarmersList();
    this.adminService.sortByDateTime(this.items)
  }

  constructor(private adminService: AdminServiceService, private toast: NgToastService) { }

  filterItems() {
    this.items = this.FarmersList.filter(farmer =>
      farmer.username.toLowerCase().includes(this.searchQuery.toLowerCase()) || farmer.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  getFarmersList() {
    this.adminService.getFarmersList().subscribe((response: any) => {
      this.FarmersList = response?.map((obj: any) => ({ ...obj, isActive: false }));
      this.items=this.FarmersList
      this.items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    })
  }

  //add value in keyValueMap
  addValue(id: string) {
    this.keyValueMap[id] = "APPROVED";
    console.log(this.keyValueMap)
  }

  //delete value in keyValueMap
  deleteValue(id: string) {
    delete this.keyValueMap[id];
    console.log(this.keyValueMap)
  }

  //get size of keyValueMap
  getSize(): number {
    return Object.keys(this.keyValueMap).length;
  }

  onFarmer(event: any) {
    const id = event.target.value;
    const checked = event.target.checked;

    console.log(this.FarmersList)
    this.FarmersList = this.FarmersList.map((d: any) => {

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
    if (this.getSize() == this.FarmersList.length) {
      this.selectAll = true;
    }
  }

  onActive() {
    this.isLoading = true
    this.selectAll = false
    for (const id of Object.keys(this.keyValueMap)) {
      this.keyValueMap[id] = "ACTIVE";
    }

    this.adminService.onActive(this.keyValueMap).subscribe((response: any) => {
      if (response == true) {
        this.getFarmersList()
        this.toast.success({ detail: "SUCCESS", summary: 'Active successfully', duration: 5000, position: 'topRight' });
        this.keyValueMap = {};
        this.isLoading = false
      } else {
        this.toast.error({ detail: "Error! please try again!", summary: 'Failed to Active', duration: 5000, position: 'topRight' });
        this.isLoading = false
      }
    })
  }

  onInActive() {
    this.isLoading = true
    this.selectAll = false
    for (const id of Object.keys(this.keyValueMap)) {
      this.keyValueMap[id] = "INACTIVE";
    }

    this.adminService.onInActive(this.keyValueMap).subscribe((response: any) => {
      if (response == true) {
        this.getFarmersList()
        this.toast.success({ detail: "SUCCESS", summary: 'InActive successfully', duration: 5000, position: 'topRight' });
        this.keyValueMap = {};
        this.isLoading = false
      } else {
        this.toast.error({ detail: "Error! please try again!", summary: 'Failed to InActive', duration: 5000, position: 'topRight' });
        this.isLoading = false
      }
    })
  }

  onDelete() {
    this.isLoading = true
    this.selectAll = false
    for (const id of Object.keys(this.keyValueMap)) {
      this.keyValueMap[id] = "DECLINE";
    }

    this.adminService.onDecline(this.keyValueMap).subscribe((response: any) => {
      if (response == true) {
        this.getFarmersList()
        this.toast.success({ detail: "SUCCESS", summary: 'Deleted successfully', duration: 5000, position: 'topRight' });
        this.keyValueMap = {};
        this.isLoading = false
      } else {
        this.toast.error({ detail: "Error! please try again!", summary: 'Failed to Delete', duration: 5000, position: 'topRight' });
        this.isLoading = false
      }
    })
  }
}
