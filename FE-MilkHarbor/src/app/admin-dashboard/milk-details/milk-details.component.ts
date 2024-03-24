import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { AdminServiceService } from 'src/app/services/admin-service';
import { FarmerServiceService } from 'src/app/services/farmer-service';
import { MilkCollectionServiceService } from 'src/app/services/milk-collection-service';

@Component({
  selector: 'app-milk-details',
  templateUrl: './milk-details.component.html',
  styleUrls: ['./milk-details.component.css']
})
export class MilkDetailsComponent implements OnInit {

  date_time = new Date();
  editMilkForm!: FormGroup;
  isDropdownOpen: boolean = false;
  FarmersList: any[]=[];
  isLoader: boolean = false;
  price_per_liter!: number;
  total!: number;
  milkDetails: any[] = []
  isEdit: boolean = false;


  constructor(private datePipe: DatePipe,
    private adminService: AdminServiceService,
    private farmerService:FarmerServiceService,
    private fb: FormBuilder,
    private toast: NgToastService,
    private milkCollectionService: MilkCollectionServiceService) { }

  ngOnInit(): void {
    this.getMilkCollectionDetails();
    this.getFarmersList();
  }


  onDelete(_id:string) {
    this.isLoader = true
    this.milkCollectionService.deleteMilkDetails(_id).subscribe((response:any)=>{
      if (response == true) {
        this.toast.success({ detail: "SUCCESS", summary: 'Delete Succesfully', duration: 5000, position: 'topRight' });
        this.isLoader = false
        this.getMilkCollectionDetails();
      } else {
        this.toast.error({ detail: "Error! please try again!", summary: 'Failed to Delete', duration: 5000, position: 'topRight' });
        this.isLoader = false
      }
    })
  }

  getFarmersList() {
    this.adminService.getFarmersList().subscribe((response: any) => {
      this.FarmersList = response;
    })
  }

  getMilkCollectionDetails() {
    this.milkCollectionService.getMilkCollectionDetails().subscribe((response: any) => {
      this.milkDetails = response;
    })
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onClose() {
    this.isEdit = false;
  }

  onReport(){
    
  }
}
