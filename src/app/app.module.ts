import { BrowserModule } from "@angular/platform-browser";
import {
  NgModule,
  ModuleWithProviders,
  CUSTOM_ELEMENTS_SCHEMA,
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "./shared/material.module";
import { PNPrimeModule } from "./shared/pnprime/pnprime.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ChartModule } from "angular-highcharts";
//import { HttpModule } from '@angular/http';
// import { MatRadioModule } from "@angular/material/radio";
import { NgCircleProgressModule } from "ng-circle-progress";
import { NgxSpinnerModule } from "ngx-spinner";
import { UserIdleModule } from "angular-user-idle";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NavComponent } from "./components/nav/nav.component";

import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ToastrModule } from "ng6-toastr-notifications";
import { OrderModule } from "ngx-order-pipe";
import { NgxPaginationModule } from "ngx-pagination";
import { InputTextModule } from "primeng/inputtext";
import { DropdownModule } from "primeng/dropdown";
import { SearchPipe } from "./shared/pipe-filters/pipe-search";
import { LoginComponent } from "./components/login/login.component";
import { AttendanceComponent } from "./components/attendance/attendance.component";

import { ConfigSharedModule } from "projects/HaroonConfig/src/app/app.module";
import { UMSharedModule } from "projects/HaroonU/src/app/app.module";
import { CompSharedModule } from "projects/HaroonC/src/app/app.module";
import { ForgotpasswordComponent } from "./components/forgotpassword/forgotpassword.component";

import { CookieService } from "ngx-cookie-service";
import { NgxMaskModule } from "ngx-mask";
// import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    //SearchPipe,
    LoginComponent,
    AttendanceComponent,
    ForgotpasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ConfigSharedModule.forRoot(),
    UMSharedModule.forRoot(),
    CompSharedModule.forRoot(),
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    ChartModule,
    ReactiveFormsModule,
    PNPrimeModule,
    //HttpModule,
    // MatRadioModule,
    NgCircleProgressModule.forRoot({}),
    ToastrModule.forRoot(),
    HttpClientModule,
    OrderModule,
    NgxPaginationModule,
    InputTextModule,
    DropdownModule,
    NgxSpinnerModule,
    NgxMaskModule.forRoot(),
    // Optionally you can set time for `idle`, `timeout` and `ping` in seconds.
    // Default values: `idle` is 60 (1 minutes), `timeout` is 30 (0.5 minutes)
    // and `ping` is 15 0.25 minutes).
    UserIdleModule.forRoot({ idle: 300, timeout: 300, ping: 15 }),
    // MatPasswordStrengthModule

    //SearchPipe
  ],
  providers: [AttendanceComponent, NavComponent, CookieService],
  bootstrap: [AppComponent],
  entryComponents: [NavComponent, AttendanceComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
