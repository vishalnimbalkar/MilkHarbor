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
  items: any[] = [];
  isLoading: boolean = false;
  isPopup: boolean = false;
  supplyTotal: number = 0;
  advanceTotal: number = 0;
  totalBill: number = 0;
  selectedId!: string;
  selectedUsername!: string;
  searchQuery: string = '';
  farmer!: any

  ngOnInit(): void {
    this.getFarmersList();
  }

  constructor(private milkcollectionService: MilkCollectionServiceService,
    private adminService: AdminServiceService,
    private toast: NgToastService,
    private paymentService: PaymentService,
    private advanceService: AdvanceService) { }


  filterItems() {
    this.items = this.FarmersList.filter(farmer =>
      farmer.username.toLowerCase().includes(this.searchQuery.toLowerCase()) || farmer.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  getFarmersList() {
    this.adminService.getFarmersList().subscribe((response: any) => {
      this.FarmersList = response;
      this.items = this.FarmersList
      this.FarmersList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    })
  }


  onClose2() {
    this.isPopup = false;
  }

  onClose(event: any) {
    event.stopPropagation();
  }

  onFarmer(farmer: any) {
    this.selectedId = farmer._id
    this.selectedUsername = farmer.username
    this.getMilkCollectionById(farmer._id);
    this.getAdvanceByUname(farmer.username);
    this.isPopup = true;
    this.farmer = farmer
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
    this.isLoading = true;
    setTimeout(() => {
    let milk_coll_ids: string[] = [];
    let a_ids: string[] = [];

    this.milkcollectionService.updateAll(this.selectedId).subscribe((response: any) => {
      milk_coll_ids = response
      this.advanceService.updateAll(this.selectedUsername).subscribe((response: any) => {
        a_ids = response

        const payload = {
          payment_amount: supplyTotal,
          f_id: this.selectedId,
          username: this.selectedUsername,
          status: 'SUCCESS',
          a_id: a_ids,
          milk_coll_id: milk_coll_ids
        }
        this.paymentService.payment(payload).subscribe((response: any) => {
          if (response) {
            this.toast.success({ detail: "SUCCESS", summary: 'Payment Succesfully', duration: 5000, position: 'topRight' });
            this.isPopup = false;
            this.isLoading = false;
          } else {
            this.toast.error({ detail: "Error! please try again!", summary: 'Failed to Update', duration: 5000, position: 'topRight' });
            this.isLoading = false;
          }
        })

      })
    })
  }, 2000);
  }

}
