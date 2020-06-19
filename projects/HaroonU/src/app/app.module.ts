import { BrowserModule } from "@angular/platform-browser";
import { NgModule, ModuleWithProviders } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { ChartModule } from "angular-highcharts";
// import { HttpModule } from '@angular/common/http';
import { MatRadioModule } from "@angular/material/radio";
import { NgCircleProgressModule } from "ng-circle-progress";
import { MatPasswordStrengthModule } from "@angular-material-extensions/password-strength";

import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ToastrModule } from "ng6-toastr-notifications";
import { OrderModule } from "ngx-order-pipe";
import { NgxPaginationModule } from "ngx-pagination";
import { InputTextModule } from "primeng/inputtext";
import { DropdownModule } from "primeng/dropdown";
import { CheckboxModule } from "primeng/checkbox";
import { InputSwitchModule } from "primeng/inputswitch";
import { NgxSpinnerModule } from "ngx-spinner";

// import { IgxGridModule, IgxExcelExporterService, IgxCsvExporterService } from "igniteui-angular";
import { NgxMaskModule } from "ngx-mask";

//Shared items
import { MaterialModule } from "../app/shared/material.module";
import { PNPrimeModule } from "../app/shared/pnprime/pnprime.module";
import { SearchPipe } from "../app/shared/pipe-filters/pipe-search";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { UserprofileComponent } from "./components/userprofile/userprofile.component";
import { UserrolesComponent } from "./components/userroles/userroles.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { CreatepasswordComponent } from "./components/createpassword/createpassword.component";
import { RptUserComponent } from "./components/rpt-user/rpt-user.component";
// import { ErpBottomSheetComponent } from './components/erp-bottom-sheet/erp-bottom-sheet.component';

@NgModule({
  declarations: [
    AppComponent,
    UserprofileComponent,
    UserrolesComponent,
    DashboardComponent,
    CreatepasswordComponent,
    SearchPipe,
    RptUserComponent
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
    //HttpModule,
    MatRadioModule,
    NgCircleProgressModule.forRoot({}),
    ToastrModule.forRoot(),
    HttpClientModule,
    OrderModule,
    NgxPaginationModule,
    InputTextModule,
    DropdownModule,
    // IgxGridModule,
    CheckboxModule,
    InputSwitchModule,
    NgxSpinnerModule,
    NgxMaskModule.forRoot(),
    MatPasswordStrengthModule
  ],
  // providers: [IgxExcelExporterService, IgxCsvExporterService],
  bootstrap: [AppComponent]
  // entryComponents: [ErpBottomSheetComponent],
})
export class AppModule {}

@NgModule({})
export class UMSharedModule {
  static forRoot(): ModuleWithProviders<AppModule> {
    return {
      ngModule: AppModule,
      providers: []
    };
  }
}
