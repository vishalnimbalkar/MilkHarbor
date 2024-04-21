import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AdminServiceService } from 'src/app/services/admin-service';
import { FarmerServiceService } from 'src/app/services/farmer-service';
import { Chart, registerables } from 'chart.js'
import { MilkCollectionComponent } from 'src/app/admin-dashboard/milk-collection/milk-collection.component';
import { MilkCollectionServiceService } from 'src/app/services/milk-collection-service';
Chart.register(...registerables);

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
    this.getDetails()
    this.bankForm = this.fb.group({
      b_name: ['', Validators.required],
      acc_no: ['', Validators.required],
      acc_h_name: ['', Validators.required],
      ifsc: ['', Validators.required],
    });

    this.RenderChart()
    this.RenderChart2()
  }

  constructor(private adminService: AdminServiceService,
    private fb: FormBuilder,
    private farmerService: FarmerServiceService,
    private toast: NgToastService,
    private router: Router,
    private milkCollectionService: MilkCollectionServiceService) { }

  getDetails() {
    const email: any = sessionStorage.getItem("email");
    const m_no: any = sessionStorage.getItem("m_no");
    const username: any = sessionStorage.getItem("username");
    if (email) {
      this.getUser(email);
    } else {
      this.getUser(m_no);
    }
  }

  getUser(username: string) {
    this.adminService.getUser(username).subscribe((response: any) => {
      this.user = response;
      this.profileForm = this.fb.group({
        _id: [this.user._id],
        name: [this.user.name],
        m_no: [this.user.m_no],
        password: [this.user.password],
        address: [this.user.address],
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

  onCancel() {
    this.isProfile = false
  }
  onSubmit() {
    this.adminService.updateProfile(this.profileForm.value).subscribe((response: any) => {
      if (response == true) {
        this.toast.success({ detail: "SUCCESS", summary: 'Updated successfully', duration: 5000, position: 'topRight' });
        this.isProfile = false;
        this.getDetails()
      } else {
        this.toast.error({ detail: "Error! please try again!", summary: 'Failed to Update', duration: 5000, position: 'topRight' });
        this.isProfile = false;
        this.getDetails()
      }
    })
  }

  onSubmitBank() {
    const formData = { ...this.bankForm.value };
    let id;
    if (sessionStorage.getItem("id")) {
      id = sessionStorage.getItem("id");
    }
    if (id) {
      formData.f_id = parseInt(id);
      formData.acc_no = parseInt(formData.acc_no)
    }
    this.farmerService.addBank(formData).subscribe((response: any) => {
      if (response == true) {
        this.toast.success({ detail: "SUCCESS", summary: 'Approved successfully', duration: 5000, position: 'topRight' });
      } else {
        this.toast.error({ detail: "Error! please try again!", summary: 'Failed to Approve', duration: 5000, position: 'topRight' });
      }
    })
  }

  onLogout() {
    this.router.navigate(['/login'])
  }

  colorData = ['#f0210a','#edb35c','#e5e827','#69e344','#44e0e3','#3057d9','#bf30d9']
  colorData2 = ['#bf30d9','#3057d9','#44e0e3','#69e344','#e5e827','#edb35c','#f0210a']

  RenderChart() {
    const myChart = new Chart('piechart', {
      type: 'bar',
      data: {
        labels: [3,4,5,6,7,8,9],
        datasets: [{
          label: '# of Quntity',
          data: [21, 19, 24, 21, 22, 23, 20],
          backgroundColor: this.colorData,
          borderColor: this.colorData,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  RenderChart2() {
    const myChart = new Chart('piechart2', {
      type: 'bar',
      data: {
        labels: [3,4,5,6,7,8,9],
        datasets: [{
          label: '# of Quntity',
          data: [221, 290, 241, 211, 220, 237, 200],
          backgroundColor: this.colorData2,
          borderColor: this.colorData2,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}