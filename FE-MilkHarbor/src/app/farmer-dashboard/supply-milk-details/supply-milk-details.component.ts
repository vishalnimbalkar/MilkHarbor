import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { ngxCsv } from 'ngx-csv';
import { AdminServiceService } from 'src/app/services/admin-service';
import { FarmerServiceService } from 'src/app/services/farmer-service';
import { MilkCollectionServiceService } from 'src/app/services/milk-collection-service';

@Component({
  selector: 'app-supply-milk-details',
  templateUrl: './supply-milk-details.component.html',
  styleUrls: ['./supply-milk-details.component.css']
})
export class SupplyMilkDetailsComponent implements OnInit{

  selectedUsername!:string;
  ngOnInit(): void {
    this.reportForm = this.fb.group({
          username: [sessionStorage.getItem('username')],
          start_date: ['', Validators.required],
          end_date: ['', Validators.required],
        }) 
    if(sessionStorage.getItem('id') && sessionStorage.getItem('username')){
      const id=sessionStorage.getItem('id');
      this.getSupplyMilkDetails(id);
      const uname=sessionStorage.getItem('username')
      this.setUsername(uname);
    }
  }

  setUsername(uname:any){
    return this.selectedUsername=uname
  }
  getSupplyMilkDetails(id:any) {
    this.milkCollectionService.getSupplyMilkDetails(id).subscribe((response: any) => {
      this.milkDetails = response;
      this.milkDetails.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    })
  }

  date_time = new Date();
  reportForm!: FormGroup;
  isDropdownOpen: boolean = false;
  FarmersList: any[] = [];
  isLoader: boolean = false;
  price_per_liter!: number;
  total!: number;
  milkDetails: any[] = []
  isEdit: boolean = false;
  startDate: any;


  constructor(
    private fb: FormBuilder,
    private toast: NgToastService,
    private milkCollectionService: MilkCollectionServiceService) { }

  onDelete(_id: string) {
    this.isLoader = true
    this.milkCollectionService.deleteMilkDetails(_id).subscribe((response: any) => {
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

  getMilkCollectionDetails() {
    this.milkCollectionService.getMilkCollectionDetails().subscribe((response: any) => {
      this.milkDetails = response;
      this.milkDetails.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    })
  }

  onPopUp() {
    this.isEdit = true;
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onFarmer(username: string) {
    this.isDropdownOpen = false;
  }
  onClose() {
    this.isEdit = false;
    this.reportForm.reset();
  }

  generate(data: any[], username: string, startDate: string, endDate: string) {

    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      title: 'MilkCollectionRecord',
      useBom: true,
      noDownload: false,
      headers: ['Username', 'Email', 'Status', 'Fat', 'Quantity', 'Lactose/Degree', 'SNF', 'Price/liter', 'Total', 'Date and Time']
    };

    if (username === 'ALL') {
       // Convert input dates to JavaScript Date objects
       const startDateObj = new Date(startDate);
       const endDateObj = new Date(endDate);
 
       // Filter data based on username and date range
       const filteredData = data.filter((milkDetail: any) => {
         const createdAtDate = new Date(milkDetail.createdAt);
         return milkDetail.username === username ||
           createdAtDate >= startDateObj &&
           createdAtDate <= endDateObj;
       });
      // Prepare cleaned data by removing unwanted fields
      const cleanedData = filteredData.map((milkDetail: any) => {
        // Create a copy of the object
        const cleanedMilkDetail = { ...milkDetail };

        // Remove unwanted fields from the copied object
        delete cleanedMilkDetail._id;
        delete cleanedMilkDetail.f_id;
        delete cleanedMilkDetail.updatedAt;
        delete cleanedMilkDetail.__v;

        return cleanedMilkDetail;
      });

      new ngxCsv(cleanedData, "milk_collection_report", options);
    } else {
      // Convert input dates to JavaScript Date objects
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);

      // Filter data based on username and date range
      const filteredData = data.filter((milkDetail: any) => {
        const createdAtDate = new Date(milkDetail.createdAt);
        return milkDetail.username === username &&
          createdAtDate >= startDateObj &&
          createdAtDate <= endDateObj;
      });

      // Prepare cleaned data by removing unwanted fields
      const cleanedData = filteredData.map((milkDetail: any) => {
        // Create a copy of the object
        const cleanedMilkDetail = { ...milkDetail };

        // Remove unwanted fields from the copied object
        delete cleanedMilkDetail._id;
        delete cleanedMilkDetail.f_id;
        delete cleanedMilkDetail.updatedAt;
        delete cleanedMilkDetail.__v;

        return cleanedMilkDetail;
      });

      new ngxCsv(cleanedData, "milk_collection_report", options);
    }
  }


  onReport() {
    if (this.milkDetails &&  sessionStorage.getItem('username')) {
      this.generate(this.milkDetails, this.selectedUsername, this.reportForm.get('start_date')!.value, this.reportForm.get('end_date')!.value)
    }
  }

}
