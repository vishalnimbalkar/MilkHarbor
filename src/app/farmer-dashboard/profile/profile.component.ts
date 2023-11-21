import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminServiceService } from 'src/app/services/admin-service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{

  user: any;
  bankForm!:FormGroup;

  ngOnInit(): void {
    const email: any = sessionStorage.getItem("email");
    const m_no: any = sessionStorage.getItem("m_no");
    if (email) {
      this.getUser(email);
    } else {
      this.getUser(m_no);
    }
  }

  constructor(private adminService: AdminServiceService) { }

  getUser(username: string) {
    this.adminService.getUser(username).subscribe((response: any) => {
      this.user = response;
    })
  }

  onEdit(){
    
  }



}
