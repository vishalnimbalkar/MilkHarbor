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
    this.router.navigate(['/farmer-dashboard/profile'])
  }

  onLogout(){
    this.router.navigate(['/login'])
  }
}
