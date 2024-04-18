import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminServiceService } from '../services/admin-service';
import { EncryptionService } from '../services/encryption.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  isLoader: boolean = false;
  constructor(private fb: FormBuilder,
    private router: Router,
    private adminService: AdminServiceService,
    private encrypt: EncryptionService,
    private toast: NgToastService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      m_no: ['', [Validators.required]],
      password: ['', [Validators.required,Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+,.:;<=>?[\]^{|}~]).{8,}$/),Validators.minLength(8)]]
    });
  }

  onLogin() {
    this.isLoader = true;
    setTimeout(() => {
    const formData = { ...this.loginForm.value };
    // formData.password=this.encrypt.encryptPassword(formData.password);
    this.adminService.login(formData).subscribe((response: any) => {
      if (response != false && response != null && response.is_active) {
        sessionStorage.setItem('m_no',response.m_no);
        sessionStorage.setItem('id',response._id)
        this.toast.success({ detail: "SUCCESS", summary: 'Login Successfully', duration: 5000, position: 'topRight' });
        this.isLoader = false;
        if (response.role == "ADMIN") {
          this.router.navigate(['/admin-dashboard']);
        }
        else if (response.role == "FARMER") {
          this.router.navigate(['/farmer-dashboard']);
        }
      }
      else {
        this.router.navigate(['/login']);
        this.toast.error({ detail: "Error! please try again!", summary: 'Invalid Credentials', duration: 5000, position: 'topRight' });
        this.isLoader = false;
      }
    })
  }, 2000);
  }

  onKeyPress(event: any) {
    const input = String.fromCharCode(event.keyCode);
    const numericPattern = /^[0-9]+$/;
    if (!numericPattern.test(input)) {
      event.preventDefault();
    }
  }
}
