import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit{

  constructor(private router: Router, private route:ActivatedRoute){

  }

  ngOnInit(): void {
    this.router.navigate(['/admin-dashboard/profile'])
  }

  // isActive!:boolean;
  // onActive(){
  //   this.isActive=false
  // }
  // onInviteFarmers(){
  //   this.router.navigate(['/invite-farmers']);
  // }
  // onPendingApprovals(){
  //   this.router.navigate(['/pending-approvals']);
  // }
  // onFarmerList(){
  //   this.router.navigate(['/farmer-list']);
  // }
  // onMilkCollection(){
  //   this.router.navigate(['/milk-collection']);
  // }
  // onMilkDetails(){
  //   this.router.navigate(['/milk-details']);
  // }
  onLogout(){

  }
}
