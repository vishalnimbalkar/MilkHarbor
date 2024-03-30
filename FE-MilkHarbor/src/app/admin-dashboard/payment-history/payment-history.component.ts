import { Component, OnInit } from '@angular/core';
import { AdminServiceService } from 'src/app/services/admin-service';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit{

  paymentHistory:any[]=[]
  ngOnInit(): void {
    this.getAll();
  }

  constructor(private paymentService:PaymentService,
    private adminService:AdminServiceService){}

  getAll(){
    this.paymentService.getAll().subscribe((response:any)=>{
      this.paymentHistory=response
      this.paymentHistory.forEach((payment:any)=>{
        this.adminService.getUserId(payment.f_id).subscribe((response:any)=>{
          this.paymentHistory.filter((d:any)=>{
            if(d.f_id==response._id){
              const index=this.paymentHistory.find(d=>d.f_id==response._id);
              this.paymentHistory[index].username=response.username
            }
          })
        })
      })
    })
  }

}
