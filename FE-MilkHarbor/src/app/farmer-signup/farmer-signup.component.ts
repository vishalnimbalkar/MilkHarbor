import { Component } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptionService } from '../services/encryption.service';
import { NgToastService } from 'ng-angular-popup';
import { FarmerServiceService } from '../services/farmer-service';
import { AdminServiceService } from '../services/admin-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-farmer-signup',
  templateUrl: './farmer-signup.component.html',
  styleUrls: ['./farmer-signup.component.css']
})
export class FarmerSignupComponent {
  signupForm!: FormGroup;
  isPasswordMatch: boolean = false;
  isLoader: boolean = false;
  email!: string;
  isUsername!: boolean;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private adminService: AdminServiceService,
    private encrypt: EncryptionService,
    private toast: NgToastService) { }
  ngOnInit() {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      m_no: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      username: ['', [Validators.required, Validators.minLength(8)]],
      address: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+,.:;<=>?[\]^{|}~]).{8,}$/)]],
      repassword: ['', Validators.required],
      status: ['PENDING'],
      role: ['FARMER'],
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

    this.signupForm.valueChanges.subscribe(formValue => {
  
      if(formValue.username.length>=8){
      if(formValue.username!=""){
        this.adminService.checkUsername(formValue.username).subscribe((response) => {
          if (response==true) {
            this.isUsername= true;
          } else if (response==false){
            console.log(response)
            this.isUsername= false;
            this.signupForm.setErrors({ customError: true });
          }
        }),(error:any)=>{
          console.log(error.status)
        }
      }else{
        this.isUsername=false;
      }
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
        this.router.navigate(['/login']);
        this.isLoader = false;
      } else {
        this.toast.error({ detail: "Error! please try again!", summary: 'Invalid Credentials', duration: 5000, position: 'topRight' });
        this.router.navigate(['/farmer-signup']);
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
