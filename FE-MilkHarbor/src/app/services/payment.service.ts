import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import * as Razorpay from 'razorpay';

declare var Razorpay: any;
@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  baseUrl:string='http://localhost:5000/payment/'

  constructor(private http:HttpClient) { }

  payment(payload:any):Observable<any>{
    return this.http.post(this.baseUrl+"create",payload)
  }
  
  getAll():Observable<any>{
    return this.http.get(this.baseUrl+"get")
  }

  getByUsername(username:string){
    return this.http.get(this.baseUrl+"getByUsername/"+username)
  }
  payNow(amount:number) {
    const RozarpayOptions = {
      description: 'Sample Razorpay demo',
      currency: 'INR',
      amount: amount*100,
      name: 'Sai',
      key: 'rzp_test_e1FFEuoNOCa3rq',
      image: '',
      prefill: {
        name: 'sai kumar',
        email: 'sai@gmail.com',
        phone: '9898989898'
      },
      theme: {
        color: '#6466e3'
      },
      modal: {
        ondismiss:  () => {
          console.log('dismissed')
        }
      }
    }

    const successCallback = (paymentid: any) => {
      console.log(paymentid);
    }

    const failureCallback = (e: any) => {
      console.log(e);
    }

    Razorpay.open(RozarpayOptions,successCallback, failureCallback)
  }
 
}
