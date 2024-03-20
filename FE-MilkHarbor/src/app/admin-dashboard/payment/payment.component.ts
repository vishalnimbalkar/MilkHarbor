import { Component, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { AdminServiceService } from 'src/app/services/admin-service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit{
  FarmersList:any[]=[];
  History:any[]=[
    {
      amount:12000,
      date_time:"15-11-23 12:23"
    },
    {
      amount:14000,
      date_time:"14-11-23 12:23"
    },
    {
      amount:12000,
      date_time:"13-11-23 12:23"
    },
    {
      amount:15000,
      date_time:"12-11-23 12:23"
    }
  ];
  isLoading:boolean=false;
  isDetails:boolean=true;
  isHistory:boolean=false;
  isPopup:boolean=false;
  total:number=0;

  ngOnInit(): void {
    this.getFarmersList();
  }

  constructor(private adminService:AdminServiceService,private toast: NgToastService){}

  getFarmersList(){
    this.adminService.getFarmersList().subscribe((response:any)=>{
      this.FarmersList = response;
    })
  }

  getTotal(id:number){
    this.adminService.getTotal(id).subscribe((response:any)=>{
      this.total=response
    })
  }

  onDetails(){
    this.isDetails=true;
    this.isHistory=false;
  }
  onHistory(){
    this.isHistory=true;
    this.isDetails=false;
  }

  onClose2(){
    this.isPopup=false;
  }

  onClose(event:any){
    event.stopPropagation();
  }

  onFarmer(id:number){
    this.getTotal(id)
    this.isPopup=true;
  }
}
