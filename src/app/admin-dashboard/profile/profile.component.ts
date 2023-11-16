import { Component, OnInit } from '@angular/core';
import { AdminServiceService } from 'src/app/services/admin-service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: any;
  today_price!:string;
  price!:number;
  constructor(private adminService: AdminServiceService) { }

  ngOnInit(): void {
    const price=sessionStorage.getItem('todays_price')
    if(price){
      this.price=parseInt(price);
    }
    const email: any = sessionStorage.getItem("email");
    const m_no: any = sessionStorage.getItem("m_no");
    if (email) {
      this.getUser(email);
    } else {
      this.getUser(m_no);
    }
  }

  getUser(username: string) {
    this.adminService.getUser(username).subscribe((response: any) => {
      this.user = response;
    })
  }

  onSet(){
    sessionStorage.setItem("todays_price",this.today_price)
    this.price=parseInt(this.today_price);
    this.today_price=''
  }
  onEdit(){
    
  }
}
