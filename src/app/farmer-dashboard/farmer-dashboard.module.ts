import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FarmerDashboardRoutingModule } from './farmer-dashboard-routing.module';
import { AccountComponent } from './account/account.component';
import { PaymentDetailsComponent } from './payment-details/payment-details.component';
import { ProfileComponent } from './profile/profile.component';
import { SupplyMilkDetailsComponent } from './supply-milk-details/supply-milk-details.component';


@NgModule({
  declarations: [
    AccountComponent,
    PaymentDetailsComponent,
    ProfileComponent,
    SupplyMilkDetailsComponent
  ],
  imports: [
    CommonModule,
    FarmerDashboardRoutingModule
  ]
})
export class FarmerDashboardModule { }
