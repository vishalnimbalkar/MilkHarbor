import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { AdminServiceService } from 'src/app/services/admin-service';
import { FarmerServiceService } from 'src/app/services/farmer-service';
import { MilkCollectionServiceService } from 'src/app/services/milk-collection-service';
import { ngxCsv } from 'ngx-csv/ngx-csv'
import * as XLSX from 'xlsx';
import * as pdfmake from 'pdfmake/build/pdfmake'
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
(pdfmake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-milk-details',
  templateUrl: './milk-details.component.html',
  styleUrls: ['./milk-details.component.css']
})
export class MilkDetailsComponent implements OnInit {


  date_time = new Date();
  reportForm!: FormGroup;
  isDropdownOpen: boolean = false;
  FarmersList: any[] = [];
  isLoader: boolean = false;
  price_per_liter!: number;
  total!: number;
  selectedOption!: string;
  milkDetails: any[] = []
  filteredMilkDetails: any[] = []
  isEdit: boolean = false;
  startDate: any;


  constructor(private datePipe: DatePipe,
    private adminService: AdminServiceService,
    private farmerService: FarmerServiceService,
    private fb: FormBuilder,
    private toast: NgToastService,
    private milkCollectionService: MilkCollectionServiceService) { }

  ngOnInit(): void {
    this.reportForm = this.fb.group({
      username: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
    }) 
    this.getMilkCollectionDetails();
    this.getFarmersList();
  }


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

  getFarmersList() {
    this.adminService.getFarmersList().subscribe((response: any) => {
      this.FarmersList = response;
    })
  }

  getMilkCollectionDetails() {
    this.milkCollectionService.getMilkCollectionDetails().subscribe((response: any) => {
      this.milkDetails = response;
      this.milkDetails.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      this.filterdMilkData=this.milkDetails
    })
  }

  onPopUp() {
    this.isEdit = true;
    this.isFilter=false
    this.isDropdownOpen2 = false;
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onFarmer(username: string) {
    this.selectedOption = username;
    this.isDropdownOpen = false;
  }
  onClose() {
    this.isDropdownOpen = false;
    this.isEdit = false;
    this.reportForm.reset();
    this.isFilter=false
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
    if (this.milkDetails) {
      this.generate(this.milkDetails, this.selectedOption, this.reportForm.get('start_date')!.value, this.reportForm.get('end_date')!.value)
      console.log(this.selectedOption)
      console.log(this.reportForm.get('start_date')!.value)
      console.log(this.reportForm.get('end_date')!.value)
    }
  }

  isFilter:boolean=false;
  isDropdownOpen2:boolean=false;
  selectedFarmer!:string;
  filterdMilkData:any[]=[]

  toggleDropdown2() {
    this.isDropdownOpen2 = !this.isDropdownOpen2;
  }
  onFilter(){
    this.isFilter=true
    this.isEdit = false
  }

  onFarmer2(username:string){
    this.selectedFarmer=username
    this.isDropdownOpen2 = false;
    this.filter()
  }

  filter() {
    if(this.selectedFarmer!="ALL"){
      this.filterdMilkData = this.milkDetails.filter(data => {
        const farmers=data.username === this.selectedFarmer
        return farmers
      });
    }else{
      this.filterdMilkData=this.milkDetails
      this.selectedFarmer=''
    }
  }

  onClear(){
    this.selectedFarmer=''
    this.filterdMilkData=this.milkDetails
  }

}
