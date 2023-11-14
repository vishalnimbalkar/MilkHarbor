import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdminServiceService } from 'src/app/services/admin-service';

@Component({
  selector: 'app-milk-collection',
  templateUrl: './milk-collection.component.html',
  styleUrls: ['./milk-collection.component.css']
})
export class MilkCollectionComponent implements OnInit{

  milkForm!:FormGroup;
  isDropdownOpen:boolean=false;
  selectedOption:string='';
  FarmersList!:any;
  
  ngOnInit(): void {
    this.getFarmersList();
  }

  constructor(private adminService:AdminServiceService){}

  getFarmersList(){
    this.adminService.getFarmersList().subscribe((response:any)=>{
      this.FarmersList=response;
    })
  }
  toggleDropdown(){
    this.isDropdownOpen=!this.isDropdownOpen;
  }

}
