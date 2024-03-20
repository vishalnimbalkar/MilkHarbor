import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { ProfileComponent } from './profile/profile.component';
import { InviteFarmersComponent } from './invite-farmers/invite-farmers.component';
import { PendingApprovalsComponent } from './pending-approvals/pending-approvals.component';
import { FarmerListComponent } from './farmer-list/farmer-list.component';
import { MilkCollectionComponent } from './milk-collection/milk-collection.component';
import { MilkDetailsComponent } from './milk-details/milk-details.component';
import { PaymentComponent } from './payment/payment.component';
import { RateChartComponent } from './rate-chart/rate-chart.component';

const routes: Routes = [
  {
    path:'',component:AccountComponent,
    children: [
      {
        path:"profile",component:ProfileComponent
      },
      {
        path:"rate-chart",component:RateChartComponent
      },
      {
        path:'invite-farmers',component:InviteFarmersComponent
      },
      {
        path:'pending-approvals',component:PendingApprovalsComponent
      },
      {
        path:'farmer-list',component:FarmerListComponent
      },
      {
        path:'milk-collection',component:MilkCollectionComponent
      },
      {
        path:'milk-details',component:MilkDetailsComponent
      },
      {
        path:'payment',component:PaymentComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDashboardRoutingModule { }
