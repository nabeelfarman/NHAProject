import { BrowserModule } from "@angular/platform-browser";
import { NgModule, ModuleWithProviders } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "./shared/material.module";
import { PNPrimeModule } from "./shared/pnprime/pnprime.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SearchPipe } from "./shared/pipe-filters/pipe-search";
import { ChartModule } from "angular-highcharts";
//import { HttpModule } from '@angular/http';
import { MatRadioModule } from "@angular/material/radio";
import { NgCircleProgressModule } from "ng-circle-progress";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CertificateComponent } from "./components/certificate/certificate.component";
import { DegreeeComponent } from "./components/degreee/degreee.component";
import { SkillComponent } from "./components/skill/skill.component";

import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ToastrModule } from "ng6-toastr-notifications";
import { OrderModule } from "ngx-order-pipe";
import { NgxPaginationModule } from "ngx-pagination";
import { InputTextModule } from "primeng/inputtext";
import { DropdownModule } from "primeng/dropdown";

// import { IgxGridModule, IgxExcelExporterService, IgxCsvExporterService } from "igniteui-angular";
import { ExperienceComponent } from "./components/experience/experience.component";

@NgModule({
  declarations: [
    AppComponent,
    SearchPipe,
    CertificateComponent,
    DegreeeComponent,
    SkillComponent,
    ExperienceComponent
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
    DropdownModule
    // IgxGridModule
  ],
  // providers: [IgxExcelExporterService, IgxCsvExporterService],
  bootstrap: [AppComponent]
})
export class AppModule {}

@NgModule({})
export class ConfigSharedModule {
  static forRoot(): ModuleWithProviders<AppModule> {
    return {
      ngModule: AppModule,
      providers: []
    };
  }
}
