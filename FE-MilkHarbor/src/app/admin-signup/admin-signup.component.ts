import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminServiceService } from '../services/admin-service';
import { EncryptionService } from '../services/encryption.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-admin-signup',
  templateUrl: './admin-signup.component.html',
  styleUrls: ['./admin-signup.component.css']
})
export class AdminSignupComponent implements OnInit {

  signupForm!: FormGroup;
  isPasswordMatch: boolean = false;
  isLoader: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private adminService: AdminServiceService,
    private encrypt: EncryptionService,
    private toast: NgToastService) { }

  ngOnInit() {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      m_no: ['', [Validators.required,Validators.minLength(10), Validators.maxLength(10)]],
      password: ['', [Validators.required,Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+,.:;<=>?[\]^{|}~]).{8,}$/)]],
      repassword: ['', Validators.required],
      role: ['ADMIN'],
      status: ['APPROVED'],
      is_active: [true]
    });

    this.signupForm.valueChanges.subscribe((formValue:any) => {
      const Password = this.signupForm.get('password')?.value;
      const reEnterPassword = this.signupForm.get('repassword')?.value;
      if (Password !== reEnterPassword) {
        this.signupForm.setErrors({ customError: true });
        this.isPasswordMatch = true;
      } else {
        this.isPasswordMatch = false;
      }
    });
  }

  onSignup() {
    this.isLoader = true;
    const formData = { ...this.signupForm.value };
    delete formData.repassword;
    // formData.password=this.encrypt.encryptPassword(formData.password);
    this.adminService.register(formData).subscribe((response: any) => {
      if (response == true) {
        this.toast.success({ detail: "SUCCESS", summary: 'Account Created Successfully', duration: 5000, position: 'topRight' });
        this.isLoader = false;
        this.router.navigate(['/login']);
      } else {
        this.toast.error({ detail: "Error! please try again!", summary: 'Invalid Credentials', duration: 5000, position: 'topRight' });
        this.router.navigate(['/admin-signup']);
        this.isLoader = false;
      }
    })
  }

  onKeyPress(event: any) {
    const input = String.fromCharCode(event.keyCode);
    const numericPattern = /^[0-9]+$/;
    if (!numericPattern.test(input)) {
      event.preventDefault();
    }
  }
}
