import { Component } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminServiceService } from '../services/admin-service';
import { EncryptionService } from '../services/encryption.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-farmer-signup',
  templateUrl: './farmer-signup.component.html',
  styleUrls: ['./farmer-signup.component.css']
})
export class FarmerSignupComponent {
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
      email: ['VishalNimbalkar78@gmail.com', [Validators.required, Validators.email]],
      m_no: ['', Validators.required],
      password: ['', Validators.required],
      repassword: ['', Validators.required],
      role: ['FARMER'],
      status: ['PENDING'],
      is_active: [false]
    });

    this.signupForm.valueChanges.subscribe(formValue => {
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
    this.adminService.register(this.signupForm.value).subscribe((response: any) => {
      if (response == true) {
        this.toast.success({ detail: "SUCCESS", summary: 'Account Created Successfully', duration: 5000, position: 'topRight' });
        this.router.navigate(['/login']);
        this.isLoader = false;
      } else {
        this.toast.error({ detail: "Error! please try again!", summary: 'Invalid Credentials', duration: 5000, position: 'topRight' });
        this.router.navigate(['/farmer-signup']);
        this.isLoader = false;
      }
    })

  }
}
