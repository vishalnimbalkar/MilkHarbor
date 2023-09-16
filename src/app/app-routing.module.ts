import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AdminSignupComponent } from './admin-signup/admin-signup.component';
import { FarmerSignupComponent } from './farmer-signup/farmer-signup.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'home', pathMatch: 'full'
  },
  {
    path:'home', component:HomeComponent
  },
  {
    path:'login', component:LoginComponent
  },
  {
    path:'admin-signup', component:AdminSignupComponent
  },
  {
    path:'farmer-signup', component:FarmerSignupComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
