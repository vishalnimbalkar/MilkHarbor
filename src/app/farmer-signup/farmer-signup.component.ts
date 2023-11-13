import { Component } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptionService } from '../services/encryption.service';
import { NgToastService } from 'ng-angular-popup';
import { FarmerServiceService } from '../services/farmer-service';
import { AdminServiceService } from '../services/admin-service';

@Component({
  selector: 'app-farmer-signup',
  templateUrl: './farmer-signup.component.html',
  styleUrls: ['./farmer-signup.component.css']
})
export class FarmerSignupComponent {
  signupForm!: FormGroup;
  isPasswordMatch: boolean = false;
  isLoader: boolean = false;
  email!:string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private farmerService: FarmerServiceService,
    private encrypt: EncryptionService,
    private toast: NgToastService) { }
  ngOnInit() {

    const id = this.route.snapshot.params['f_id'];
    this.onBackCall(id);

    this.signupForm = this.fb.group({
      id:[id],
      name: ['', Validators.required],
      m_no: ['', Validators.required],
      password: ['', Validators.required],
      repassword: ['', Validators.required],
      status: ['PENDING']
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
    this.farmerService.signup(formData).subscribe((response: any) => {
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

  onBackCall(id:any){
    this.farmerService.onBackCall(id).subscribe((response:any)=>{
      this.email=response.email;
    })
  }
}
