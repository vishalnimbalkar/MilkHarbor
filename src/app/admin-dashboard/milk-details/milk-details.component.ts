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
  selectedOption: string = 'Vishal Nimbalkar';
  selectedId!: string;
  FarmersList: any;
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

  onEdit(detail: any) {
    this.isEdit = true;
    this.editMilkForm = this.fb.group({
      f_id: [this.selectedId, Validators.required],
      milk_qnt: [detail.milk_qnt, Validators.required],
      milk_fat: [detail.milk_fat, Validators.required],
      milk_lac_deg: [detail.milk_lac_deg, Validators.required]
    })
  }

  //   {
  //     "m_id": 30,
  //     "milk_qnt": 5,
  //     "milk_fat": 5.0,
  //     "milk_lac_deg": 0.0,
  //     "f_id": 0,
  //     "price_per_liter": 0.0,
  //     "total": 0.0,
  //     "date_time": null
  // }

  onSubmit() {
    this.isLoader = true
    this.milkCollectionService.updateMilkDetails(this.editMilkForm.value).subscribe((response: any) => {
      if (response == true) {
        this.toast.success({ detail: "SUCCESS", summary: 'Details Updated Succesfully', duration: 5000, position: 'topRight' });
        this.isLoader = false
      } else {
        this.toast.error({ detail: "Error! please try again!", summary: 'Failed', duration: 5000, position: 'topRight' });
        this.isLoader = false
      }
    })
  }

  onDelete(id:number) {
    this.isLoader = true
    this.milkCollectionService.deleteMilkDetails(id).subscribe((response:any)=>{
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

  onFarmer(id: string, name: string) {
    this.selectedOption = name;
    this.selectedId = id;
    this.isDropdownOpen = false;
  }


  onClose() {
    this.isEdit = false;
  }

  onReport(){
    
  }
}
