import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AdminServiceService } from 'src/app/services/admin-service';
import { FarmerServiceService } from 'src/app/services/farmer-service';
import { MilkCollectionServiceService } from 'src/app/services/milk-collection-service';
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables);

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: any;
  today_price!:string;
  price!:number;
  farmerCount:number=0;
  pendingApprovals:number=0;
  milkCollCount:number=0;
  totalMilk:number=0;
  date_time!: Date;
  baseprice!:any;

  profileForm!: FormGroup;
  isProfile: boolean = false;
  constructor(private adminService: AdminServiceService,private milkDetails:MilkCollectionServiceService
    , private datePipe: DatePipe, private farmerService:FarmerServiceService,
    private toast: NgToastService,private fb:FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.RenderChart()
    if(sessionStorage.getItem("baseprice")){
      this.baseprice=sessionStorage.getItem("baseprice");
    }
    this.getDetails()
    this.getFarmers();
    this.getPendingApprovals()
    this.getMilkDetails()
  }

  getDetails(){
    const m_no: any = sessionStorage.getItem("m_no");
      this.getUser(m_no);
  }
  getUser(username: string) {
    this.adminService.getUser(username).subscribe((response: any) => {
      this.user = response;
      this.profileForm = this.fb.group({
        _id:[this.user._id],
        name: [this.user.name],
        m_no: [this.user.m_no],
        password: [this.user.password],
        address: [this.user.address],
      });
    })
  }

  getFarmers(){
    this.adminService.getFarmersList().subscribe((response:any)=>{
      for(let i=0;i<response.length;i++){
        this.farmerCount+=1;
      }
    })
  }

 getPendingApprovals(){
  this.adminService.getPendingFarmers().subscribe((response:any)=>{
    this.pendingApprovals=response.length;
  })
 }

 getMilkDetails(){
  const currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  this.milkDetails.getMilkCollectionDetails().subscribe((response:any)=>{
    const specificDateMilkDetails = response.filter(
      (milk:any) =>
        this.datePipe.transform(milk.createdAt, 'yyyy-MM-dd') === currentDate
    );
    console.log(specificDateMilkDetails)
    this.milkCollCount=specificDateMilkDetails.length;
    specificDateMilkDetails.forEach((element:any) => {
      this.totalMilk+=element.milk_qnt;
    });
  })
 }

  onEdit(){
    this.isProfile = true;
  }

  onCancel(){
    this.isProfile=false
  }
  onSubmit() {
    this.adminService.updateProfile(this.profileForm.value).subscribe((response:any)=>{
      if(response==true){
        this.toast.success({ detail: "SUCCESS", summary: 'Updated successfully', duration: 5000, position: 'topRight' });
        this.isProfile = false;
        this.getDetails()
      } else {
        this.toast.error({ detail: "Error! please try again!", summary: 'Failed to Update', duration: 5000, position: 'topRight' });
        this.isProfile = false;
        this.getDetails()
      }
    })
  }

  onLogout(){
    this.router.navigate(['/login'])
    this.toast.success({ detail: "SUCCESS", summary: 'Logout successfully', duration: 5000, position: 'topRight' });
  }

  colorData = ['#f0210a','#edb35c','#e5e827','#69e344','#44e0e3','#3057d9','#bf30d9']
  colorData2 = ['#bf30d9','#3057d9','#44e0e3','#69e344','#e5e827','#edb35c','#f0210a']

  RenderChart() {
    const myChart = new Chart('piechart', {
      type: 'bar',
      data: {
        labels: [3,4,5,6,7,8,9],
        datasets: [{
          label: '# of Quntity',
          data: [500, 550, 520, 570, 600, 450, 470],
          backgroundColor: this.colorData,
          borderColor: this.colorData,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
