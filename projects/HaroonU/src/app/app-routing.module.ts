import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserprofileComponent } from './components/userprofile/userprofile.component';
import { UserrolesComponent } from './components/userroles/userroles.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreatepasswordComponent } from './components/createpassword/createpassword.component';
import { RptUserComponent } from './components/rpt-user/rpt-user.component';

const routes: Routes = [
  {
    path: 'UM/userDashboard',
    component: DashboardComponent
  },
  {
    path: 'UM/userProfile',
    component: UserprofileComponent
  },
  {
    path: 'UM/userRole',
    component: UserrolesComponent
  },
  {
    path: 'UM/createPassword',
    component: CreatepasswordComponent
  },
  {
    path: 'UM/userReport',
    component: RptUserComponent
  },
  
  { path: 'UM', redirectTo: 'UM/userProfile' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
