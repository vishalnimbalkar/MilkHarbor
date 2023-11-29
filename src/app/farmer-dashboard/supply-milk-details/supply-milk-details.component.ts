import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { AdminServiceService } from 'src/app/services/admin-service';
import { FarmerServiceService } from 'src/app/services/farmer-service';
import { MilkCollectionServiceService } from 'src/app/services/milk-collection-service';

@Component({
  selector: 'app-supply-milk-details',
  templateUrl: './supply-milk-details.component.html',
  styleUrls: ['./supply-milk-details.component.css']
})
export class SupplyMilkDetailsComponent implements OnInit{
  milkDetails: any[] = []

  constructor(
    private milkCollectionService: MilkCollectionServiceService) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('id')){
      const id=sessionStorage.getItem('id');
      this.getSupplyMilkDetails(id);
    }
  }

  getSupplyMilkDetails(id:any) {
    this.milkCollectionService.getSupplyMilkDetails(id).subscribe((response: any) => {
      this.milkDetails = response;
    })
  }
 
  onReport(){
    
  }
}
