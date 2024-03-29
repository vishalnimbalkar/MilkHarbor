import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import * as Razorpay from 'razorpay';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  baseUrl:string='http://localhost:5000/payment/'


  constructor(private http:HttpClient) { }

  // payment(amount: number) {
  //   return this.http.post('createOrder', { amount });
  // }

  // razorpayPayment(amount:number) {
  //   this.payment(amount).subscribe((response:any) => {
  //     if (response==true) {
  //       let options = {
  //         key_id: "rzp_test_z9a6EnvRff6nr7",
  //         amount: response.data.amount,
  //         currency: response.data.currency,
  //         name: "Scrumrabit",
  //         description: "Scrumrabit Plan",
  //         image: '',
  //         order_id: response.data.orderId,

  //         handler: function (response: any) {
  //           console.log("success: "+response)
  //          alert("payment success")
  //         },

  //         prefill: {
  //           name: "vishal",
  //           email: "vishal@gmail.com",
  //           contact: "65465465463"
  //         },
  //         notes: {
  //           address: ""
  //         },
  //         theme: {
  //           color: "#3399cc"
  //         }
  //       };

  //       const rzp1 = new Razorpay(options);
  //         rzp1.open();

  //         rzp1.on('payment.failed', function (response: any) {
  //               console.log(response);
  //               // console.log(response.error.description);
  //               // console.log(response.error.source);
  //               // console.log(response.error.step);
  //               // console.log(response.error.reason);
  //               // console.log(response.error.metadata.order_id);
  //               // console.log(response.error.metadata.payment_id);
  //               alert("Failed")
  //             })
  //     }
  //   })
  // }

 
}
