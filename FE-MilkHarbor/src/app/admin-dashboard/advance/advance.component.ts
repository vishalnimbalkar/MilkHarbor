import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { AdminServiceService } from 'src/app/services/admin-service';
import { AdvanceService } from 'src/app/services/advance.service';

@Component({
  selector: 'app-advance',
  templateUrl: './advance.component.html',
  styleUrls: ['./advance.component.css']
})
export class AdvanceComponent implements OnInit {

  addAdvance!: FormGroup;
  isDropdownOpen: boolean = false;
  FarmersList: any[] = [];
  AdvanceList: any[] = [];
  isLoader: boolean = false;
  isEdit: boolean = false;
  selectedOption!: string;
  selectedId!: string;

  ngOnInit(): void {
    this.getAdvanceList()
    this.getFarmersList()
    this.addAdvance = this.fb.group({
      username: ['', Validators.required],
      amount: ['', Validators.required],
      type: ['', Validators.required],
      descp: ['', Validators.required]
    })
  }

  constructor(private adminService: AdminServiceService,
    private fb: FormBuilder,
    private toast: NgToastService,
    private advanceService: AdvanceService) { }

  onFarmer(username: string) {
    this.selectedOption = username;
    this.isDropdownOpen = false;
    console.log(this.selectedId)
  }

  getAdvanceList() {
    this.advanceService.get().subscribe((response: any) => {
      this.AdvanceList = response
      this.AdvanceList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    })
  }
  getFarmersList() {
    this.adminService.getFarmersList().subscribe((response: any) => {
      this.FarmersList = response;
    })
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onClose() {
    this.isEdit = false;
  }
  onAdd() {
    this.isEdit = true;
  }

  onSubmit() {
    const username = this.addAdvance.get('username')?.value;
    const type = this.addAdvance.get('type')?.value;
    const descp = this.addAdvance.get('descp')?.value;
    const amount = parseFloat(this.addAdvance.get('amount')?.value);

    const advance = {
      username: this.selectedOption,
      type: type,
      descp: descp,
      status:"PENDING",
      amount: amount,
    }

    this.advanceService.addAdvance(advance).subscribe((response) => {
      if (response.success == true) {
        this.toast.success({ detail: "SUCCESS", summary: 'Advance added successfully', duration: 5000, position: 'topRight' });
        this.getAdvanceList()
        this.isEdit = false;
        this.addAdvance.reset();
      } else {
        this.toast.error({ detail: "Error! please try again!", summary: 'Failed', duration: 5000, position: 'topRight' });
        this.isEdit = false;
      }
    })
  }

  onDelete(_id:string){
    this.advanceService.delete(_id).subscribe((response: any) => {
      if (response == true) {
        this.toast.success({ detail: "SUCCESS", summary: 'Advance Deleted successfully', duration: 5000, position: 'topRight' });
        this.getAdvanceList()
      } else {
        this.toast.error({ detail: "Error! please try again!", summary: 'Failed', duration: 5000, position: 'topRight' });
      }
    })
  }
}
