import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { ProfileComponent } from './profile/profile.component';
import { SupplyMilkDetailsComponent } from './supply-milk-details/supply-milk-details.component';
import { PaymentDetailsComponent } from './payment-details/payment-details.component';

const routes: Routes = [
  {
    path:'',component:AccountComponent,
    children: [
      {
        path:'profile',component:ProfileComponent
      },
      {
        path:'supply-milk-details',component:SupplyMilkDetailsComponent
      },
      {
        path:'payment',component:PaymentDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FarmerDashboardRoutingModule { }
