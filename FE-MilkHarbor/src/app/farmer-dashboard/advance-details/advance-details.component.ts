import { Component, OnInit } from '@angular/core';
import { AdvanceService } from 'src/app/services/advance.service';

@Component({
  selector: 'app-advance-details',
  templateUrl: './advance-details.component.html',
  styleUrls: ['./advance-details.component.css']
})
export class AdvanceDetailsComponent implements OnInit {

  Advancedata:any[]=[]
  ngOnInit(): void {
    if (sessionStorage.getItem('username')) {
      const username = sessionStorage.getItem('username');
      this.getData(username);
    }
  }

  constructor(private advanceService: AdvanceService) { }

  getData(username: any) {
    this.advanceService.getByUsername(username).subscribe((response: any) => {
      this.Advancedata=response
      this.Advancedata.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    })
  }
}
