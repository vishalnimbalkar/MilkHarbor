import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { AdminServiceService } from 'src/app/services/admin-service';
import { MilkCollectionServiceService } from 'src/app/services/milk-collection-service';

@Component({
  selector: 'app-milk-collection',
  templateUrl: './milk-collection.component.html',
  styleUrls: ['./milk-collection.component.css']
})
export class MilkCollectionComponent implements OnInit {

  milkForm!: FormGroup;
  isDropdownOpen: boolean = false;
  selectedOption!: string;
  selectedEmail!: string;
  selectedId!: string;
  FarmersList: any;
  isLoader: boolean = false;
  price_per_liter: number = 0;
  total: number = 0;
  date_time!: Date;
  minFat: number = 0;
  maxFat: number = 0;
  minSnf: number = 0;
  maxSnf: number = 0;

  constructor(private adminService: AdminServiceService,
    private milkCollectionService: MilkCollectionServiceService,
    private fb: FormBuilder,
    private toast: NgToastService,
    private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getFarmersList();
    this.milkForm = this.fb.group({
      f_id: ['', Validators.required],
      milk_qnt: ['', Validators.required],
      milk_fat: ['', Validators.required],
      milk_lac_deg: ['', Validators.required]
    })

    if (sessionStorage.getItem('rateChart')) {
      let rateChart = sessionStorage.getItem('rateChart');
      if (sessionStorage.getItem('fatStep') && sessionStorage.getItem('snfStep')) {
        let ss = sessionStorage.getItem('fatStep');
        let ff = sessionStorage.getItem('snfStep');
        if (ss && ff) {
          let storedArray = JSON.parse(ss);
          let storedArray2 = JSON.parse(ff);
          this.fatStep = storedArray;
          this.snfStep = storedArray2;
        }
      }
      if (rateChart && this.snfStep && this.fatStep) {
        let storedArray = JSON.parse(rateChart);
        this.minFat = Math.min(...this.fatStep.map((obj: any) => obj.step));
        this.maxFat = Math.max(...this.fatStep.map((obj: any) => obj.step));
        this.minSnf = Math.min(...this.snfStep.map((obj: any) => obj.step));
        this.maxSnf = Math.max(...this.snfStep.map((obj: any) => obj.step));
        this.snfRange = []
        this.fatRange = []
        for (let i = this.minSnf; i <= this.maxSnf; i += 0.10) {
          this.snfRange.push(i);
        }
        for (let i = this.minFat; i <= this.maxFat; i += 0.10) {
          this.fatRange.push(i);
        }
        this.arr = storedArray;
      }
    }

    if (sessionStorage.getItem('baseprice')) {
      let baseprice = sessionStorage.getItem('baseprice');
      if (baseprice) {
        let numberBasePrice = JSON.parse(baseprice);
        this.basePrice = numberBasePrice;
      }
    }

  }

  calculateSnf(fat: number, lac_deg: number) {
    return (0.25 * lac_deg) + (0.22 * fat) + 0.72;
  }

  getFarmersList() {
    this.adminService.getFarmersList().subscribe((response: any) => {
      this.FarmersList = response;
    })
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onFarmer(id: string, username: string, email:string) {
    this.selectedOption = username;
    this.selectedEmail = email;
    this.selectedId = id;
    this.isDropdownOpen = false;
    console.log(this.selectedId)

  }
  onSubmit() {
    const qnt = parseFloat(this.milkForm.get('milk_qnt')?.value);
    const fat = parseFloat(this.milkForm.get('milk_fat')?.value);
    const lac_deg = parseFloat(this.milkForm.get('milk_lac_deg')?.value);
    const snf = this.calculateSnf(fat, lac_deg);
    let milk_snf = parseFloat(snf.toFixed(1));
    if(milk_snf<this.minSnf){
      milk_snf=this.minSnf
    }else if(milk_snf>this.maxSnf){
      milk_snf=this.maxSnf
    }
    const price = this.calculatePrice(fat, milk_snf)
    this.isLoader = true;
    this.total = price * qnt;
    console.log(this.selectedId)
    
    const mc = {
      f_id:this.selectedId,
      username:this.selectedOption,
      email:this.selectedEmail,
      milk_qnt: qnt,
      milk_lac_deg: lac_deg,
      milk_fat: fat,
      status:"PENDING",
      milk_snf: milk_snf,
      price_per_liter: price,
      total: this.total
    }
    console.log("mc" + mc.price_per_liter, "  total" + mc.total)
    this.milkCollectionService.onMilkCollection(mc).subscribe((response: any) => {
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

  arr!: number[][];
  fatStep: any[]=[
    { step: 3 },
    { step: 3.1 },
    { step: 3.2 },];
  snfStep: any[]=[
    { step: 6 },
    { step: 6.1 },
    { step: 6.2 },
  ];
  basePrice!: number;


  fatRange: number[] = []
  snfRange: number[] = []
  fatIndex: number = 0;
  snfIndex: number = -1;
  // calCulatePrice(fat: number, snf: number) {
  //   const minFat = Math.min(...this.fatStep.map((obj: any) => obj.step));
  //   const minSnf = Math.min(...this.snfStep.map((obj: any) => obj.step));
  //   for (let i = minFat; i <= fat; i += 0.10) {
  //     this.fatIndex += 1;
  //   }
  //   for (let i = minSnf; i <= snf; i += 0.10) {
  //     this.snfIndex += 1;
  //   }
  //   const price = this.arr[this.fatIndex][this.snfIndex]
  //   console.log("price : " + price)
  //   return price;
  // }

   calculatePrice(fat: number, snf: number) {
    const minFat = Math.min(...this.fatStep.map((obj: any) => obj.step));
    const minSnf = Math.min(...this.snfStep.map((obj: any) => obj.step));

    // Calculate index based on step size
    const fatIndex = Math.round((fat - minFat) / 0.10);
    const snfIndex = Math.round((snf - minSnf) / 0.10);

    // Ensure index is within bounds
    const safeFatIndex = Math.max(0, Math.min(fatIndex, this.arr.length - 1));
    const safeSnfIndex = Math.max(0, Math.min(snfIndex, this.arr[safeFatIndex].length - 1));

    const price = this.arr[safeFatIndex][safeSnfIndex];
    console.log("price : " + price);
    return price;
}

}




