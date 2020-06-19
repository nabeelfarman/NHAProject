import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanydashboardComponent } from './components/companydashboard/companydashboard.component';
import { CompanyComponent } from './components/company/company.component';
import { HeadquarterComponent} from './components/headquarter/headquarter.component';
import { BranchComponent } from './components/branch/branch.component';
import { DepartmentComponent } from './components/department/department.component';
import { SectionComponent } from './components/section/section.component';
import { SubsidiarieComponent } from './components/subsidiarie/subsidiarie.component';
import { CurrencyComponent } from './components/currency/currency.component';
import { NewCompanyComponent } from './components/new-company/new-company.component';

const routes: Routes = [
  {
    path: 'Comp/dashboard',
    component: CompanydashboardComponent
  },
  {
    path: 'Comp/newcmpany',
    component: CompanyComponent
  },
  {
    path: 'Comp/editcmpany',
    component: CompanyComponent
  },
  {
    path: 'Comp/headquarter',
    component: HeadquarterComponent
  },
  {
    path: 'Comp/branch',
    component: BranchComponent
  },
  {
    path: 'Comp/department',
    component: DepartmentComponent
  },
  {
    path: 'Comp/section',
    component: SectionComponent
  },
  {
    path: 'Comp/subsidiaries',
    component: SubsidiarieComponent
  },
  {
    path: 'Comp/currency',
    component: CurrencyComponent
  },
  { path: 'Comp', redirectTo: 'Comp/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
