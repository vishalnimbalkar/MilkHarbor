import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminServiceService } from 'src/app/services/admin-service';
import { MilkCollectionServiceService } from 'src/app/services/milk-collection-service';

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
  constructor(private adminService: AdminServiceService,private milkDetails:MilkCollectionServiceService
    , private datePipe: DatePipe) { }

  ngOnInit(): void {
    if(sessionStorage.getItem("baseprice")){
      this.baseprice=sessionStorage.getItem("baseprice");
    }
    const email: any = sessionStorage.getItem("email");
    const m_no: any = sessionStorage.getItem("m_no");
    if (email) {
      this.getUser(email);
    } else {
      this.getUser(m_no);
    }

    this.getFarmers();
    this.getPendingApprovals()
    this.getMilkDetails()
  }

  getUser(username: string) {
    this.adminService.getUser(username).subscribe((response: any) => {
      this.user = response;
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
        this.datePipe.transform(milk.date_time, 'yyyy-MM-dd') === currentDate
    );
    console.log(specificDateMilkDetails)
    this.milkCollCount=specificDateMilkDetails.length;
    specificDateMilkDetails.forEach((element:any) => {
      this.totalMilk+=element.milk_qnt;
    });
  })
 }

  onEdit(){
    
  }
}
