import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { MilkCollectionServiceService } from 'src/app/services/milk-collection-service';

@Component({
  selector: 'app-rate-chart',
  templateUrl: './rate-chart.component.html',
  styleUrls: ['./rate-chart.component.css']
})
export class RateChartComponent implements OnInit {
[x: string]: any;

  fatStep: any = [
    {
      step: 3,
      amount: 0.10
    },
    {
      step: 3.5,
      amount: 0.20
    },
    {
      step: 4,
      amount: 0.30
    },
    {
      step: 4.5,
      amount: 0.40
    },
    {
      step: 5,
      amount: 0
    },
    {
      step: 5.5,
      amount: 0
    }

  ]
  snfStep: any = [
    {
      step: 8,
      amount: 0.10
    },
    {
      step: 8.5,
      amount: 0.20
    },
    {
      step: 9,
      amount: 0.30
    },
    {
      step: 9.5,
      amount: 0
    },
    {
      step: 10,
      amount: 0
    }

  ]
  isPopup: boolean = false;
  isFatStep: boolean = false;
  isSnfStep: boolean = false;
  isRateChart: boolean = false;
  stepForm!: FormGroup;
  baseprice!: number;
  isCurrentRateChart:boolean=false;


  ngOnInit(): void {

    if(sessionStorage.getItem('rateChart')){
      this.isCurrentRateChart=true;
    }else{
      this.isCurrentRateChart=false;
    }
    this.stepForm = this.fb.group({
      step: ['', Validators.required],
      amount: ['', Validators.required]
    })
  }

  constructor(private fb: FormBuilder, private milkCollService:MilkCollectionServiceService,private toast: NgToastService) { }

  onClose() {
    this.isPopup = false;
  }
  onClose2(event: any) {
    event.stopPropagation();
  }
  onStep(data: string) {
    if (data === "fat") {
      this.isFatStep = true;
      this.isSnfStep = false;
    } else {
      this.isSnfStep = true;
      this.isFatStep = false;
    }
    this.isPopup = true;
  }

  onCancel() {
    this.isPopup = false;
    this.stepForm.reset();
  }

  onOk() {
    console.log(this.stepForm.value)
    if (this.isFatStep) {
      this.fatStep.push(this.stepForm.value);
    } else {
      this.snfStep.push(this.stepForm.value)
    }
    this.isPopup = false;
    this.stepForm.reset();
  }

  onRemoveFat(data: any) {
    if (data !== -1) {
      this.fatStep.splice(data, 1);
    }
  }
  onRemoveSnf(data: any) {
    if (data !== -1) {
      this.snfStep.splice(data, 1);
    }
  }

  onGenerate() {
    this.isRateChart = true
    this.calculatemilkPrice()
  }


  arr!: number[][];
  snfRange: number[] = []
  fatRange: number[] = []

  calculatemilkPrice() {
    const minFat = Math.min(...this.fatStep.map((obj: any) => obj.step));
    const maxFat = Math.max(...this.fatStep.map((obj: any) => obj.step));
    const minSnf = Math.min(...this.snfStep.map((obj: any) => obj.step));
    const maxSnf = Math.max(...this.snfStep.map((obj: any) => obj.step));

    this.snfRange=[]
    this.fatRange=[]
      for (let i = minSnf; i <= maxSnf; i += 0.10) {
        this.snfRange.push(i);
      }
      for (let i = minFat; i <= maxFat; i += 0.10) {
        this.fatRange.push(i);
      }
    
    this.arr = [];
    for (let i = minFat; i < maxFat; i += 0.1) {
      const row: number[] = [];
      for (let j = minSnf; j < maxSnf; j += 0.1) {
        let fatAmt = 0;
        let snfAmt = 0;
        for (let k = minFat; k <= i; k += 0.1) {
          if (k != minFat) {
            for (let amountstep = 0; amountstep < this.fatStep.length - 1; amountstep++) {
              const currentFat = this.fatStep[amountstep];
              const nextFat = this.fatStep[amountstep + 1];
              if (k <= nextFat.step + 0.10) {
                fatAmt += currentFat.amount;
                break;
              }
            }
          }
        }
        for (let m = minSnf; m <= j; m += 0.1) {
          if (m != minSnf) {
            for (let amountstep = 0; amountstep < this.snfStep.length - 1; amountstep++) {
              const currentSnf = this.snfStep[amountstep];
              const nextSnf = this.snfStep[amountstep + 1];
              if (m <= nextSnf.step) {
                snfAmt += currentSnf.amount;
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

  step:any[]=[];


  onSubmitCahrt() {
    this.isCurrentRateChart=true;
    this.step.push(this.fatStep);
    this.step.push(this.snfStep);
    var arrayString = JSON.stringify(this.arr);
    sessionStorage.setItem("rateChart",arrayString)

    var arrayString2 = JSON.stringify(this.fatStep);
    sessionStorage.setItem("fatStep",arrayString2)

    var arrayString3 = JSON.stringify(this.snfStep);
    sessionStorage.setItem("snfStep",arrayString3)
    
    var basePrice = JSON.stringify(this.baseprice);
    sessionStorage.setItem("baseprice",basePrice)
    this.isRateChart=false;
    this.toast.success({ detail: "SUCCESS", summary: 'Submit Rate Chart Successfully', duration: 5000, position: 'topRight' });
  }

  onCancelCahrt() {
    this.isRateChart = false;
    this.isViewRateChart=false
  }
  onCancelCahrt2(event: any) {
    event.stopPropagation();
  }

  isViewRateChart:boolean=false;
  viewRateChart(){
    this.isViewRateChart=true
    if(sessionStorage.getItem('rateChart')){
      let rateChart = sessionStorage.getItem('rateChart');
      let fatStep = sessionStorage.getItem('fatStep');
      let snfStep = sessionStorage.getItem('snfStep');
      if(rateChart && snfStep && fatStep){
        let storedArray = JSON.parse(rateChart);
        const minFat = Math.min(...this.fatStep.map((obj: any) => obj.step));
        const maxFat = Math.max(...this.fatStep.map((obj: any) => obj.step));
        const minSnf = Math.min(...this.snfStep.map((obj: any) => obj.step));
        const maxSnf = Math.max(...this.snfStep.map((obj: any) => obj.step));
    
        this.snfRange=[]
        this.fatRange=[]
          for (let i = minSnf; i <= maxSnf; i += 0.10) {
            this.snfRange.push(i);
          }
          for (let i = minFat; i <= maxFat; i += 0.10) {
            this.fatRange.push(i);
          }
        this.arr=storedArray;
        this.isRateChart=true;
      }
    }
  }
}
