import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { AdminServiceService } from 'src/app/services/admin-service';
import { FarmerServiceService } from 'src/app/services/farmer-service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: any;
  bankForm!: FormGroup;
  profileForm!: FormGroup;
  isBank: boolean = false;
  isProfile: boolean = false;

  ngOnInit(): void {
    const email: any = sessionStorage.getItem("email");
    const m_no: any = sessionStorage.getItem("m_no");
    if (email) {
      this.getUser(email);
    } else {
      this.getUser(m_no);
    }
    this.bankForm = this.fb.group({
      b_name: ['', Validators.required],
      acc_no: ['', Validators.required],
      acc_h_name: ['', Validators.required],
      ifsc: ['', Validators.required],
    });

  }

  constructor(private adminService: AdminServiceService,
    private fb: FormBuilder,
    private farmerService:FarmerServiceService,
    private toast: NgToastService) { }

  getUser(username: string) {
    this.adminService.getUser(username).subscribe((response: any) => {
      this.user = response;
      this.profileForm = this.fb.group({
        name: [this.user.name],
        email: [this.user.email],
        m_no: [this.user.m_no]
      });
    })
  }

  onEdit(data: string) {
    if (data == 'profile') {
      this.isProfile = true;
      this.isBank = false;
      console.log(data)
    }
    if (data == 'bank') {
      console.log(data)
      this.isProfile = false;
      this.isBank = true;
    }
  }

  onSubmit() {
    this.farmerService.updateProfile(this.profileForm.value).subscribe((response:any)=>{
      if(response==true){
        this.toast.success({ detail: "SUCCESS", summary: 'Approved successfully', duration: 5000, position: 'topRight' });
      } else {
        this.toast.error({ detail: "Error! please try again!", summary: 'Failed to Approve', duration: 5000, position: 'topRight' });
      }
    })
  }


}
