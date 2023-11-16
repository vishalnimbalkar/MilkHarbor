import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { AdminServiceService } from 'src/app/services/admin-service';

@Component({
  selector: 'app-milk-details',
  templateUrl: './milk-details.component.html',
  styleUrls: ['./milk-details.component.css']
})
export class MilkDetailsComponent implements OnInit{

  date_time=new Date();
  editMilkForm!:FormGroup;
  isDropdownOpen:boolean=false;
  selectedOption:string='Vishal Nimbalkar';
  selectedId!:string;
  FarmersList:any;
  isLoader:boolean=false;
  price_per_liter!:number;
  total!:number;
  milkDetails:any[]=[
    {
      f_id:10,
      milk_qnt:12,
      milk_fat:5,
      milk_lac_deg:11,
      price_per_liter:35,
      total:300,
      date_time: this.datePipe.transform(this.date_time, 'yyyy-MM-dd HH:mm')

    },
    {
      f_id:11,
      milk_qnt:12,
      milk_fat:5,
      milk_lac_deg:11,
      price_per_liter:35,
      total:300,
      date_time: this.datePipe.transform(this.date_time, 'yyyy-MM-dd HH:mm')
    },
    {
      f_id:12,
      milk_qnt:12,
      milk_fat:5,
      milk_lac_deg:11,
      price_per_liter:35,
      total:300,
      date_time: this.datePipe.transform(this.date_time, 'yyyy-MM-dd HH:mm')
    }
  ]
  isEdit:boolean=false;

  constructor(private datePipe: DatePipe,
              private adminService:AdminServiceService,
              private fb: FormBuilder,
              private toast: NgToastService){}

  ngOnInit(): void {
    this.editMilkForm=this.fb.group({
      f_id:['',Validators.required],
      milk_qnt:[34,Validators.required],
      milk_fat:[5,Validators.required],
      milk_lac_deg:[8,Validators.required]
    })
  }

  onEdit(){
    this.isEdit=true;
  }

  onDelete(){
  }

  getFarmersList(){
    this.adminService.getFarmersList().subscribe((response:any)=>{
      this.FarmersList=response;
    })
  }
  toggleDropdown(){
    this.isDropdownOpen=!this.isDropdownOpen;
  }

  onFarmer(id:string,name:string){
    this.selectedOption=name;
    this.selectedId=id;
    this.isDropdownOpen=false;
  }

  onSubmit(){

  }

  onClose(){
    this.isEdit=false;
  }
}
