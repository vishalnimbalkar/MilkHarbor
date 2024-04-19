import { Component, OnInit } from '@angular/core';
import { AdminServiceService } from 'src/app/services/admin-service';
import { AdvanceService } from 'src/app/services/advance.service';
import { MilkCollectionServiceService } from 'src/app/services/milk-collection-service';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit{

  paymentHistory:any[]=[]
  isPopup:boolean=false;
  isFarmer:boolean=true;
  isMc:boolean=false;
  isAdvance:boolean=false;
  ngOnInit(): void {
    this.getAll();
  }

  constructor(private paymentService:PaymentService,
    private adminService:AdminServiceService,
    private milkCollectionService:MilkCollectionServiceService,
    private advanceService:AdvanceService){}

    getAll() {
      this.paymentService.getAll().subscribe((response: any) => {
        this.paymentHistory = response;
        this.paymentHistory.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      });
    }
    
    
  onClose2() {
    this.isPopup = false;
  }

  onClose(event: any) {
    event.stopPropagation();
  }

  payment:any;
  farmer:any;
  advances:any=[];
  milkCollections:any=[];
  onPayment(payment:any){
    this.payment=payment
    this.isPopup=true
    payment.milk_coll_id.forEach((element:any) => {
      this.milkCollectionService.getById(element).subscribe((response:any)=>{
        this.milkCollections.push(response[0]);
      })
    }); 
     payment.a_id.forEach((element:any) => {
      this.advanceService.getById(element).subscribe((response:any)=>{
        this.advances.push(response);
      })
    });

      this.adminService.getUserId(payment.f_id).subscribe((response:any)=>{
        this.farmer=response
      })
  }

  onDetails(data:string){
    if(data=='farmer'){
      this.isFarmer=true;
      this.isMc=false;
      this.isAdvance=false
    }else if(data=='mc'){
      this.isFarmer=false;
      this.isMc=true;
      this.isAdvance=false
    }else{
      this.isFarmer=false;
      this.isMc=false;
      this.isAdvance=true
    }
  }
}
