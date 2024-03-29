import { Component, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { AdminServiceService } from 'src/app/services/admin-service';
import { AdvanceService } from 'src/app/services/advance.service';
import { MilkCollectionServiceService } from 'src/app/services/milk-collection-service';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  FarmersList: any[] = [];
  History: any[] = [
    {
      amount: 12000,
      date_time: "15-11-23 12:23"
    },
    {
      amount: 14000,
      date_time: "14-11-23 12:23"
    },
    {
      amount: 12000,
      date_time: "13-11-23 12:23"
    },
    {
      amount: 15000,
      date_time: "12-11-23 12:23"
    }
  ];
  isLoading: boolean = false;
  isDetails: boolean = true;
  isHistory: boolean = false;
  isPopup: boolean = false;
  supplyTotal: number = 0;
  advanceTotal: number = 0;
  totalBill: number = 0;
  selectedId!: string;
  selectedUsername!: string;
  farmer!:any

  ngOnInit(): void {
    this.getFarmersList();
  }

  constructor(private milkcollectionService: MilkCollectionServiceService,
    private adminService: AdminServiceService,
    private toast: NgToastService,
    private paymentService: PaymentService,
    private advanceService: AdvanceService) { }

  getFarmersList() {
    this.adminService.getFarmersList().subscribe((response: any) => {
      this.FarmersList = response;
    })
  }

  onDetails() {
    this.isDetails = true;
    this.isHistory = false;
  }
  onHistory() {
    this.isHistory = true;
    this.isDetails = false;
  }

  onClose2() {
    this.isPopup = false;
  }

  onClose(event: any) {
    event.stopPropagation();
  }

  onFarmer(farmer:any) {
    this.selectedId = farmer._id
    this.selectedUsername = farmer.username
    this.getMilkCollectionById(farmer._id);
    this.getAdvanceByUname(farmer.username);
    this.isPopup = true;
    this.farmer=farmer
  }

  getMilkCollectionById(id: string) {
    this.supplyTotal = 0;
    this.milkcollectionService.getSupplyMilkDetails(id).subscribe((response: any) => {
      const data = response
      data.forEach((d: any) => [
        this.supplyTotal = this.supplyTotal + d.total
      ])
    })
  }

  getAdvanceByUname(username: string) {
    this.advanceTotal = 0;
    this.advanceService.getByUname(username).subscribe((response) => {
      const data = response
      data.forEach((d: any) => [
        this.advanceTotal = this.advanceTotal + d.amount
      ])
    })
  }

  onPay(supplyTotal: number) {
    this.milkcollectionService.updateAll(this.selectedId).subscribe((response: any) => {
      if (response == true) {
        this.toast.success({ detail: "SUCCESS", summary: 'Payment Succesfully', duration: 5000, position: 'topRight' });
        this.isPopup = false;
      } else {
        this.toast.error({ detail: "Error! please try again!", summary: 'Failed to Update', duration: 5000, position: 'topRight' });
      }
    })

    this.advanceService.updateAll(this.selectedUsername).subscribe((response: any) => {
      if (response == true) {
        this.toast.success({ detail: "SUCCESS", summary: 'Payment Succesfully', duration: 5000, position: 'topRight' });
        this.isPopup = false;
      } else {
        this.toast.error({ detail: "Error! please try again!", summary: 'Failed to Update', duration: 5000, position: 'topRight' });
      }
    })
  }
  
}
