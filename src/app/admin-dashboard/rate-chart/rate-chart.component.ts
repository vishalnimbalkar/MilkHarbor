import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-rate-chart',
  templateUrl: './rate-chart.component.html',
  styleUrls: ['./rate-chart.component.css']
})
export class RateChartComponent implements OnInit{

  snfStep:any=[]
  fatStep:any=[]
  isPopup:boolean=false;
  isFatStep:boolean=false;
  isSnfStep:boolean=false;
  stepForm!:FormGroup;
  baseprice!:number;

  ngOnInit(): void {
    this.stepForm=this.fb.group({
      step:['',Validators.required],
      amount:['',Validators.required]
    })
  }

  constructor(private fb:FormBuilder){}

  onClose(){
    this.isPopup=false;
  }
  onClose2(event:any){
    event.stopPropagation();
  }
  onStep(data:string){
    if(data==="fat"){
      this.isFatStep=true;
      this.isSnfStep=false;
    }else{
      this.isSnfStep=true;
      this.isFatStep=false;
    }
    this.isPopup=true;
  }

  onCancel(){
    this.isPopup=false;
    this.stepForm.reset();
  }

  onOk(){
    console.log(this.stepForm.value)
    if(this.isFatStep){
      this.fatStep.push(this.stepForm.value);
    }else{
      this.snfStep.push(this.stepForm.value)
    }
    this.isPopup=false;
    this.stepForm.reset();
    this.calculatemilkPrice()
  }

  onRemoveFat(data:any){
    if (data !== -1) {
      this.fatStep.splice(data, 1);
    }
    this.calculatemilkPrice()
  } 
  onRemoveSnf(data:any){
    if (data !== -1) {
      this.snfStep.splice(data, 1);
    }
    this.calculatemilkPrice()
  }

  arr!: number[][];

  calculatemilkPrice() {
    const minFat = Math.min(...this.fatStep.map((obj: any) => obj.step));
    const maxFat = Math.max(...this.fatStep.map((obj: any) => obj.step));
    const minSnf = Math.min(...this.snfStep.map((obj: any) => obj.step));
    const maxSnf = Math.max(...this.snfStep.map((obj: any) => obj.step));

    this.arr = [];
    for (let i = minFat; i <= maxFat + 0.1; i += 0.1) {
      const row: number[] = [];
      for (let j = minSnf; j <= maxSnf; j += 0.1) {
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
}
