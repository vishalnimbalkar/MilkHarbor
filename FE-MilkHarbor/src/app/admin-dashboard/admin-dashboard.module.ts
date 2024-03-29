import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';
import { AccountComponent } from './account/account.component';
import { ProfileComponent } from './profile/profile.component';
import { PendingApprovalsComponent } from './pending-approvals/pending-approvals.component';
import { FarmerListComponent } from './farmer-list/farmer-list.component';
import { MilkCollectionComponent } from './milk-collection/milk-collection.component';
import { MilkDetailsComponent } from './milk-details/milk-details.component';
import { InviteFarmersComponent } from './invite-farmers/invite-farmers.component';
import { Router } from '@angular/router';
import { PaymentComponent } from './payment/payment.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RateChartComponent } from './rate-chart/rate-chart.component';
import { AdvanceComponent } from './advance/advance.component';


@NgModule({
  declarations: [
    AccountComponent,
    ProfileComponent,
    PendingApprovalsComponent,
    FarmerListComponent,
    MilkCollectionComponent,
    MilkDetailsComponent,
    InviteFarmersComponent,
    PaymentComponent,
    RateChartComponent,
    AdvanceComponent,
  ],
  imports: [
    CommonModule,
    AdminDashboardRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule 
  ]
})
export class AdminDashboardModule {}
