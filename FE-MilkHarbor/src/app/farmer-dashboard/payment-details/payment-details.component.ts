import { Component, OnInit } from '@angular/core';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.css']
})
export class PaymentDetailsComponent implements OnInit{

  paymentData:any[]=[]
  ngOnInit(): void {
    if (sessionStorage.getItem('username')) {
      const username = sessionStorage.getItem('username');
      this.getData(username);
    }
  }

  constructor(private paymentService:PaymentService){}

  getData(username:any){
    this.paymentService.getByUsername(username).subscribe((response:any)=>{
      this.paymentData=response
    })
  }
}
