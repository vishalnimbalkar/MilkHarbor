import { Component, OnInit } from '@angular/core';
import { AdminServiceService } from 'src/app/services/admin-service';

@Component({
  selector: 'app-pending-approvals',
  templateUrl: './pending-approvals.component.html',
  styleUrls: ['./pending-approvals.component.css']
})
export class PendingApprovalsComponent implements OnInit{

  PendingFarmers:any[]=[];
  ngOnInit(): void {
    this.getPendingFarmers();
  }

  constructor(private adminService:AdminServiceService){}

  getPendingFarmers(){
    this.adminService.getPendingFarmers().subscribe((response:any)=>{
      this.PendingFarmers=response;
    })
  }


}
