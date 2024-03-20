import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { FarmerDashboardRoutingModule } from './farmer-dashboard-routing.module';
import { AccountComponent } from './account/account.component';
import { PaymentDetailsComponent } from './payment-details/payment-details.component';
import { ProfileComponent } from './profile/profile.component';
import { SupplyMilkDetailsComponent } from './supply-milk-details/supply-milk-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AccountComponent,
    PaymentDetailsComponent,
    ProfileComponent,
    SupplyMilkDetailsComponent
  ],
  imports: [
    CommonModule,
    FarmerDashboardRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class FarmerDashboardModule { }
