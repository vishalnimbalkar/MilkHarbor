import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { AdminServiceService } from 'src/app/services/admin-service';

@Component({
  selector: 'app-milk-collection',
  templateUrl: './milk-collection.component.html',
  styleUrls: ['./milk-collection.component.css']
})
export class MilkCollectionComponent implements OnInit{

  milkForm!:FormGroup;
  isDropdownOpen:boolean=false;
  selectedOption!:string;
  selectedId!:string;
  FarmersList:any;
  isLoader:boolean=false;
  price_per_liter!:number;
  total!:number;
  date_time!: Date;
  
  constructor(private adminService:AdminServiceService,
              private fb: FormBuilder,
              private toast: NgToastService,
              private datePipe: DatePipe){}

  ngOnInit(): void {
    this.getFarmersList();

    this.milkForm=this.fb.group({
      f_id:['',Validators.required],
      milk_type:['',Validators.required],
      milk_qnt:['',Validators.required],
      milk_fat:['',Validators.required],
      milk_snf:['',Validators.required]
    })
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
    this.isLoader=true;
    this.date_time=new Date();
    this.datePipe.transform(this.date_time, 'yyyy-MM-dd HH:mm:ss')
    const mc={
      f_id:parseInt(this.selectedId),
      milk_type:this.milkForm.get('milk_type')?.value,
      milk_qnt:parseInt(this.milkForm.get('milk_qnt')?.value),
      milk_fat:parseFloat(this.milkForm.get('milk_fat')?.value),
      milk_snf:parseFloat(this.milkForm.get('milk_snf')?.value),
      price_per_liter:this.price_per_liter,
      total:this.total,
      date_time: this.datePipe.transform(this.date_time, 'yyyy-MM-dd HH:mm:ss')
    }
    this.adminService.onMilkCollection(mc).subscribe((response:any)=>{
      if (response == true) {
        this.toast.success({ detail: "SUCCESS", summary: 'Collection added successfully', duration: 5000, position: 'topRight' });
        this.isLoader = false;
        this.milkForm.reset();
      } else {
        this.toast.error({ detail: "Error! please try again!", summary: 'Failed', duration: 5000, position: 'topRight' });
        this.isLoader = false;
      }
    })
  }

}
