import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { AdminServiceService } from 'src/app/services/admin-service';
import { FarmerServiceService } from 'src/app/services/farmer-service';
import { MilkCollectionServiceService } from 'src/app/services/milk-collection-service';
import {ngxCsv} from 'ngx-csv/ngx-csv'
import * as XLSX from 'xlsx';

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
data:any[]=[]
  onReport(){
    this.milkCollectionService.generateReport().subscribe(
      (response: any) => {
        if (response!='') {
          this.jsonData = response;
          this.downloadFile();
          this.toast.success({ detail: "SUCCESS", summary: 'Report Generated Successfully', duration: 5000, position: 'topRight' });
          this.getMilkCollectionDetails();
        } else {
          this.toast.error({ detail: "Error! Please try again!", summary: 'Failed to Generate Report', duration: 5000, position: 'topRight' });
        }
      },
      (error) => {
        console.error('Error:', error);
        this.toast.error({ detail: "Error! Please try again!", summary: 'Failed to Generate Report', duration: 5000, position: 'topRight' });
      }
    );
  }

  jsonData:any[] = [
    {
        "username": "system2",
        "milk_fat": 5,
        "milk_qnt": 55,
        "milk_lac_deg": 5,
        "milk_snf": 8,
        "price_per_liter": 26.9,
        "total": 1479.5
    },
    {
        "username": "system2",
        "milk_fat": 4,
        "milk_qnt": 44,
        "milk_lac_deg": 4,
        "milk_snf": 8,
        "price_per_liter": 23.5,
        "total": 1034
    },
    {
        "username": "system2",
        "milk_fat": 4,
        "milk_qnt": 9,
        "milk_lac_deg": 9,
        "milk_snf": 8,
        "price_per_liter": 23.5,
        "total": 211.5
    },
    {
        "username": "vishal78",
        "milk_fat": 3,
        "milk_qnt": 99,
        "milk_lac_deg": 9,
        "milk_snf": 8,
        "price_per_liter": 22,
        "total": 2178
    }
];
  downloadFile() {

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.jsonData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
    XLSX.writeFile(wb, 'MilkCollectionReport.xlsx');


    // let options = { 
    //   fieldSeparator: ',',
    //   quoteStrings: '"',
    //   decimalseparator: '.',
    //   showLabels: true, 
    //   showTitle: false,
    //   title: 'MilkCollectionRecord',
    //   useBom: true,
    //   noDownload: false,
    //   headers: ['username', 'milk_fat', 'milk_qnt', 'milk_lac_deg', 'milk_snf', 'price_per_liter', 'total' ]
    // };
   
    // new ngxCsv(this.data, "MilkCollectionRecord", options);
  }
}
