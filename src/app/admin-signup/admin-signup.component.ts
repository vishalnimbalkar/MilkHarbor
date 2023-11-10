import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminServiceService } from '../services/admin-service';
import { EncryptionService } from '../services/encryption.service';

@Component({
  selector: 'app-admin-signup',
  templateUrl: './admin-signup.component.html',
  styleUrls: ['./admin-signup.component.css']
})
export class AdminSignupComponent implements OnInit{

  signupForm!: FormGroup;
  isPasswordMatch:boolean=false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private adminService:AdminServiceService,
    private encrypt:EncryptionService){}
  ngOnInit(){
    this.signupForm = this.fb.group({
      name:['',Validators.required],
      email: ['', [Validators.required, Validators.email]],
      m_no:['',Validators.required],
      password:['',Validators.required],
      repassword:['',Validators.required],
      role:['ADMIN'],
      status:['APPROVE'],
      is_active:[true]
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

  onSignup(){
    const formData = { ...this.signupForm.value };
    delete formData.repassword;
    // formData.password=this.encrypt.encryptPassword(formData.password);
    this.adminService.register(formData).subscribe((response:any)=>{
      if(response==true){
        this.router.navigate(['/login']);
      }else{
        this.router.navigate(['/admin-signup']);
      }
    })

}
}
