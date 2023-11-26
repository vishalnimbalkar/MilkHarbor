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
  selectedId!: string;
  FarmersList: any;
  isLoader: boolean = false;
  price_per_liter: number = 0;
  total: number = 0;
  date_time!: Date;

  constructor(private adminService: AdminServiceService,
    private milkCollectionService: MilkCollectionServiceService,
    private fb: FormBuilder,
    private toast: NgToastService,
    private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.calculatemilkPrice();
    this.getFarmersList();
    this.milkForm = this.fb.group({
      f_id: ['', Validators.required],
      milk_qnt: ['', Validators.required],
      milk_fat: ['', Validators.required],
      milk_lac_deg: ['', Validators.required]
    })

    //     this.milkForm.valueChanges.subscribe(formValue => {
    //       const fat=formValue.milk_fat;
    //       const lac=formValue.milk_lac_deg;

    //       const snf= (0.25 * lac) + (0.22 * fat) + 0.72;
    //       this.price_per_liter=(0.22 * fat) + (0.36 * snf) + 0.32;
    //       this.total=formValue.milk_qnt*this.price_per_liter;

    // console.log('Lac:', lac);
    // console.log('fat:', fat);
    // console.log('SNF:', snf);
    // console.log('Price per Liter:', this.price_per_liter);
    // console.log('Total:', this.total);

    //       Milk price per liter = (0.22 x Fat%) + (0.36 x SNF%) + 0.32

    // SNF = (0.25 x Lac/deg) + (0.22 x Fat%) + 0.72
    // }); 



  }



  getFarmersList() {
    this.adminService.getFarmersList().subscribe((response: any) => {
      this.FarmersList = response;
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
  onSubmit() {
    this.isLoader = true;
    this.date_time = new Date();
    this.datePipe.transform(this.date_time, 'yyyy-MM-dd HH:mm:ss')
    const mc = {
      f_id: parseInt(this.selectedId),
      milk_qnt: parseInt(this.milkForm.get('milk_qnt')?.value),
      milk_fat: parseFloat(this.milkForm.get('milk_fat')?.value),
      milk_lac_deg: parseFloat(this.milkForm.get('milk_lac_deg')?.value),
      price_per_liter: this.price_per_liter,
      total: this.total,
      date_time: this.datePipe.transform(this.date_time, 'yyyy-MM-dd HH:mm:ss')
    }
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
  steps_fat: any = [
    {
      step: 3,
      amt: 0.10
    },
    {
      step: 3.5,
      amt: 0.50
    }
  ]
  steps_snf: any = [
    {
      step: 8,
      amt: 0.10
    },
    {
      step: 8.5,
      amt: 0.50
    },{
      step:9,
      amt:0
    }
  ]

  baseprice: number = 20;
  arr!: number[][];

  calculatemilkPrice() {
    const minFat = Math.min(...this.steps_fat.map((obj: any) => obj.step));
    const maxFat = Math.max(...this.steps_fat.map((obj: any) => obj.step));
    const minSnf = Math.min(...this.steps_snf.map((obj: any) => obj.step));
    const maxSnf = Math.max(...this.steps_snf.map((obj: any) => obj.step));

    this.arr = [];
    for (let i = minFat; i <= maxFat + 0.1; i += 0.1) {
      const row: number[] = [];
      for (let j = minSnf; j <= maxSnf; j += 0.1) {
        let fatAmt = 0;
        let snfAmt = 0;
        for (let k = minFat; k <= i; k += 0.1) {
          if (k != minFat) {
            for (let amountstep = 0; amountstep < this.steps_fat.length - 1; amountstep++) {
              const currentFat = this.steps_fat[amountstep];
              const nextFat = this.steps_fat[amountstep + 1];
              if (k <= nextFat.step + 0.10) {
                fatAmt += currentFat.amt;
                break;
              }
            }
          }
        }
        for (let m = minSnf; m <= j; m += 0.1) {
          if (m != minSnf) {
            for (let amountstep = 0; amountstep < this.steps_snf.length - 1; amountstep++) {
              const currentSnf = this.steps_snf[amountstep];
              const nextSnf = this.steps_snf[amountstep + 1];
              if (m <= nextSnf.step) {
                snfAmt += currentSnf.amt;
                break;
              }
            }
          }
        }
        const newValue = this.baseprice + fatAmt + snfAmt;
        row.push(newValue);
      }
      this.arr.push(row);
    }
  }

}  