import { BrowserModule } from "@angular/platform-browser";
import { NgModule, ModuleWithProviders } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ChartModule } from "angular-highcharts";
import { ToastrModule } from "ng6-toastr-notifications";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgxMaskModule } from "ngx-mask";
import { NgxPaginationModule } from "ngx-pagination";
import { OrderModule } from "ngx-order-pipe";
import { NgxSpinnerModule } from "ngx-spinner";
// import { ExportAsModule } from 'ngx-export-as';
// import { IgxGridModule, IgxExcelExporterService, IgxCsvExporterService } from "igniteui-angular";
// import { DropdownModule } from "primeng/primeng";

//shared items
import { MaterialModule } from "../app/shared/material.module";
import { PNPrimeModule } from "../app/shared/pnprime/pnprime.module";
import { SearchPipe } from "../app/shared/pipe-filters/pipe-search";
import { MatStepperModule } from "@angular/material/stepper";
//import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
//import { MaterialModule } from '../../../../src/app/shared/material.module';
//import { PNPrimeModule } from '../../../../src/app/shared/pnprime/pnprime.module';
//import { SearchPipe } from '../../../../src/app/shared/pipe-filters/pipe-search';

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BranchComponent } from "./components/branch/branch.component";
import { CompanyComponent } from "./components/company/company.component";
import { CompanydashboardComponent } from "./components/companydashboard/companydashboard.component";
import { CurrencyComponent } from "./components/currency/currency.component";
import { DepartmentComponent } from "./components/department/department.component";
import { HeadquarterComponent } from "./components/headquarter/headquarter.component";
import { SectionComponent } from "./components/section/section.component";
import { SubsidiarieComponent } from "./components/subsidiarie/subsidiarie.component";

import { SharedmodModule } from "src/app/components/sharedmod.module";
import { ConfigAddressComponent } from "src/app/components/config-address/config-address.component";
import { ConfigContactComponent } from "src/app/components/config-contact/config-contact.component";
import { NewCompanyComponent } from "./components/new-company/new-company.component";

@NgModule({
  declarations: [
    AppComponent,
    BranchComponent,
    CompanyComponent,
    CompanydashboardComponent,
    CurrencyComponent,
    DepartmentComponent,
    HeadquarterComponent,
    SectionComponent,
    SubsidiarieComponent,
    SearchPipe,
    NewCompanyComponent
    // AddressComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    ChartModule,
    ReactiveFormsModule,
    PNPrimeModule,
    ToastrModule.forRoot(),
    //HttpModule,
    HttpClientModule,
    NgxMaskModule.forRoot(),
    // IgxGridModule,
    NgxPaginationModule,
    OrderModule,
    NgxSpinnerModule,
    // ExportAsModule,
    // DropdownModule,
    MatStepperModule,
    SharedmodModule
  ],
  providers: [
    // IgxExcelExporterService,
    // IgxCsvExporterService,
    ConfigAddressComponent,
    ConfigContactComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

@NgModule({})
export class CompSharedModule {
  static forRoot(): ModuleWithProviders<AppModule> {
    return {
      ngModule: AppModule,
      providers: []
    };
  }
}
