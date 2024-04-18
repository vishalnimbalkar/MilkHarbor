  import { Component, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
  import { AdminServiceService } from 'src/app/services/admin-service';

  @Component({
    selector: 'app-invite-farmers',
    templateUrl: './invite-farmers.component.html',
    styleUrls: ['./invite-farmers.component.css']
  })
  export class InviteFarmersComponent implements OnInit{
    email: string = '';
    FarmersEmails: string[] = [];
    isLoader:boolean=false;
    
    ngOnInit(): void {
      
    }
    constructor(private adminService:AdminServiceService,
      private toast: NgToastService){}

    onAdd() {
      if(this.email!==''){
        this.FarmersEmails.push(this.email);
        this.email = '';
      }
    }
    isValidEmail(email: string): boolean {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
  }

    onDelete(i:number){
      this.FarmersEmails.splice(i,1);
    }

    onInvite(){
      this.isLoader=true;
      this.adminService.inviteFarmers(this.FarmersEmails).subscribe((response:any)=>{
        if(response==true){
          this.isLoader=false;
          this.toast.success({ detail: "SUCCESS", summary: 'Invite Successfully', duration: 5000, position: 'topRight' });
          this.FarmersEmails=[]
        }else{
          this.isLoader=false;
          this.toast.error({ detail: "Error! please try again!", summary: 'Invalid Credentials', duration: 5000, position: 'topRight' });
        }
      })
    }

  }
