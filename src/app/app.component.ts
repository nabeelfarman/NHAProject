import {
  Component,
  ModuleWithProviders,
  ViewChild,
  ElementRef,
  HostListener,
} from "@angular/core";
import { MenuItem } from "primeng/api";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { Event, Router, NavigationStart, NavigationEnd } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { UserIdleService } from "angular-user-idle";
import { OnInit } from "@angular/core";

import { NavComponent } from "./components/nav/nav.component";
import { AttendanceComponent } from "./components/attendance/attendance.component";

import { ToastrManager } from "ng6-toastr-notifications";
// import {
//   IgxExcelExporterOptions,
//   IgxExcelExporterService,
//   IgxGridComponent,
//   IgxCsvExporterService,
//   IgxCsvExporterOptions,
//   CsvFileTypes
// } from "igniteui-angular";

declare var $: any;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  serverUrl = "http://ambit-erp.southeastasia.cloudapp.azure.com:9010/";

  // serverUrl = "http://localhost:9010/";

  tokenKey = "token";

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  panelOpenState = false;

  //modules variable declaration
  public branchList = [];
  public locationId;
  public cmpnyId;
  public empId;
  public cmpnyName;

  companyProfileEditStatus = false;

  logedInUserName = "";

  txtCrntPassword = "";
  txtNewPassword = "";
  txtCnfrmPassword = "";
  txtPin = "";

  pin = "";

  public hideDiv = false;
  items: MenuItem[];

  @ViewChild("exportPDF") public exportPDF: ElementRef;

  // @ViewChild("excelDataContent") public excelDataContent: IgxGridComponent; //For excel

  excelDataList: any;

  constructor(
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private navApp: NavComponent,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    public toastr: ToastrManager,
    // private excelExportService: IgxExcelExporterService,
    // private csvExportService: IgxCsvExporterService,
    private userIdle: UserIdleService // private attendApp: AttendanceComponent
  ) {}

  ngOnInit() {
    //this.moduleHR = this.navApp.moduleHR;

    this.checkLogin("No");

    //this.activeModule("No");

    this.items = [
      {
        label: "File",
        icon: "pi pi-fw pi-file",
        items: [
          {
            label: "New",
            icon: "pi pi-fw pi-plus",
            items: [{ label: "Project" }, { label: "Other" }],
          },
          { label: "Open" },
          { separator: true },
          { label: "Quit" },
        ],
      },
      {
        label: "Edit",
        icon: "pi pi-fw pi-pencil",
        items: [
          { label: "Delete", icon: "pi pi-fw pi-trash" },
          { label: "Refresh", icon: "pi pi-fw pi-refresh" },
        ],
      },
      {
        label: "Help",
        icon: "pi pi-fw pi-question",
        items: [
          {
            label: "Contents",
          },
          {
            label: "Search",
            icon: "pi pi-fw pi-search",
            items: [
              {
                label: "Text",
                items: [
                  {
                    label: "Workspace",
                  },
                ],
              },
              {
                label: "File",
              },
            ],
          },
        ],
      },
      {
        label: "Actions",
        icon: "pi pi-fw pi-cog",
        items: [
          {
            label: "Edit",
            icon: "pi pi-fw pi-pencil",
            items: [
              { label: "Save", icon: "pi pi-fw pi-save" },
              { label: "Update", icon: "pi pi-fw pi-save" },
            ],
          },
          {
            label: "Other",
            icon: "pi pi-fw pi-tags",
            items: [{ label: "Delete", icon: "pi pi-fw pi-minus" }],
          },
        ],
      },
      { separator: true },
      {
        label: "Quit",
        icon: "pi pi-fw pi-times",
      },
    ];
  }

  convertStringToDate(stringDate) {
    var dateParts = stringDate.split("/");
    var day = dateParts[0];
    var month = dateParts[1];
    var year = dateParts[2];

    return new Date(month + "/" + day + "/" + year);
  }

  getUserDetail(name) {
    this.locationId = localStorage.getItem("loc");
    this.cmpnyId = localStorage.getItem("ci");
    this.cmpnyName = localStorage.getItem("cn");
    this.empId = localStorage.getItem("ei");

    var Token = localStorage.getItem(this.tokenKey);
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + Token,
    });

    var loginData = { IndvdlERPUsrID: name };

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post(this.serverUrl + "api/getUserDetail", loginData, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        // this.cmpnyId = data.userDetail[0].cmpnyID;
        // this.cmpnyName = data.userDetail[0].locationName;
        // this.locationId = data.userDetail[0].locationCd;
        // this.empId = data.userDetail[0].indvdlID;

        for (var i = 0; i < data.userDetail.length; i++) {
          this.branchList.push({
            label: data.userDetail[i].locationName,
            value: data.userDetail[i].locationCd,
          });

          //alert(data.userDetail[i].locationName);
        }
      });
  }

  showAttendance() {
    this.bottomSheet.open(AttendanceComponent);
  }

  //show bottom sheet
  showBottom() {
    this.bottomSheet.open(NavComponent);
  }

  //*Functions for Show & Hide Spinner
  showSpinner() {
    this.spinner.show();
  }

  hideSpinner() {
    setTimeout(() => {
      /** spinner ends after process done*/
      this.spinner.hide();
    }, 1000);
  }

  //method for show and hide manu bar with login and logout user
  showDiv() {
    this.hideDiv = true;
    // if (this.router.url != "/") {
    //   this.hideDiv = true;

    // } else {
    //   this.hideDiv = false;
    // }
    // if (localStorage.getItem('token') != null) {
    //     this.hideDiv = true;
    //     this.userName = localStorage.getItem('userName');
    // }
    // else {
    //     this.hideDiv = false;
    // }
  }

  //mehtod for logout user
  Logout() {
    this.stopWatching();
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("myActModNam");

    localStorage.removeItem("loc");
    localStorage.removeItem("ci");
    localStorage.removeItem("cn");
    localStorage.removeItem("ei");

    this.router.navigate([""]);
    this.hideDiv = false;
    this.closeNav();
  }

  public printCSS() {
    var commonCss =
      ".commonCss{font-family: Arial, Helvetica, sans-serif; text-align: center; }";

    var cssHeading = ".cssHeading {font-size: 25px; font-weight: bold;}";
    var cssAddress = ".cssAddress {font-size: 16px; }";
    var cssContact = ".cssContact {font-size: 16px; }";

    var tableCss =
      "table {width: 100%; border-collapse: collapse;}    table thead tr th {text-align: left; font-family: Arial, Helvetica, sans-serif; font-weight: bole; border-bottom: 1px solid black; margin-left: -3px;}     table tbody tr td {font-family: Arial, Helvetica, sans-serif; border-bottom: 1px solid #ccc; margin-left: -3px; height: 33px;}";

    var printCss = commonCss + cssHeading + cssAddress + cssContact + tableCss;

    return printCss;
  }

  /* Set the width of the side navigation to 250px */
  public openNav() {
    if (this.router.url != "/home") {
      $(".sidenavContainer").fadeIn("slow", function () {});
    }

    document.getElementById("mySidenav").style.width = "248px";

    this.startWatching();

    // Start watching when user idle is starting.
    this.userIdle.onTimerStart().subscribe((count) => this.Logout());
  }

  /* Set the width of the side navigation to 0 */
  closeNav() {
    document.getElementById("mySidenav").style.width = "0";

    $(".sidenavContainer").fadeOut("slow", function () {});
  }

  //*function for checking login already logedin or not
  checkLogin(loginChk) {
    //alert(this.moduleHR);

    if (localStorage.getItem("userName") != null) {
      this.logedInUserName = localStorage.getItem("userName");
      this.showDiv();

      if (loginChk == "Yes") {
        this.router.navigate(["home"]);
      }

      if (this.cmpnyId == undefined) {
        var UserName = localStorage.getItem("userName");
        this.getUserDetail(UserName);
      }
    } else {
      this.router.navigate([""]);
    }
  }

  genPin() {
    $("#generatePinModal").modal("show");
    this.txtPin = "";
    this.getUserDetail(localStorage.getItem("userName"));
  }

  activePin() {
    //checking if pin is empty
    if (this.txtPin.trim().length == 0) {
      this.toastr.errorToastr("Please Enter Pin", "Oops!", {
        toastTimeout: 2500,
      });
      return;
    } else {
      this.showSpinner();

      var empData = { indvdlID: this.empId, pin: this.txtPin };

      this.http
        .post(this.serverUrl + "api/activePin", empData)
        .subscribe((data: any) => {
          // this.http.post('http://localhost:5000/api/activePin', empData).subscribe((data: any) => {

          if (data.msg == "Sorry! Pin not Correct.") {
            this.hideSpinner();
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 5000 });
            return false;
          } else {
            this.hideSpinner();
            this.pin = this.txtPin;
            this.txtPin = "";
            this.toastr.successToastr(
              "Your Pin is Active! Now you can delete.",
              "Success!",
              { toastTimeout: 2500 }
            );
            $("#generatePinModal").modal("hide");
            return false;
          }
        });
    }
  }

  sendPin() {
    this.showSpinner();

    var empData = { indvdlID: this.empId };

    this.http
      .post(this.serverUrl + "api/checkPin", empData)
      .subscribe((data: any) => {
        // this.http.post('http://localhost:5000/api/checkPin', empData).subscribe((data: any) => {

        if (data.msg != "Mail Sent!") {
          this.hideSpinner();
          this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 5000 });
          return false;
        } else {
          this.hideSpinner();
          this.toastr.successToastr(data.msg, "Success!", {
            toastTimeout: 2500,
          });
          return false;
        }
      });
  }

  //user idle functions
  stop() {
    this.userIdle.stopTimer();
  }

  stopWatching() {
    this.userIdle.stopWatching();
  }

  startWatching() {
    this.userIdle.startWatching();
  }

  restart() {
    this.userIdle.resetTimer();
  }

  //function for validate email
  public validateEmail(Email) {
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (!filter.test(Email)) {
      return false;
    } else {
      return true;
    }
  }

  public convertDate(myDate) {
    var oldDate = new Date(myDate);
    var d = oldDate.getDate();
    var m = oldDate.getMonth();
    m += 1; // JavaScript months are 0-11
    var y = oldDate.getFullYear();

    var convertedDate = m + "-" + d + "-" + y;

    return convertedDate;
  }

  //* -------------- CSV Export --------------
  // public download_CSV(csvDataList) {
  //   if (csvDataList.length > 0) {
  //     this.csvExportService.exportData(
  //       csvDataList,
  //       new IgxCsvExporterOptions("downloadCompleteCSV", CsvFileTypes.CSV)
  //     );
  //   } else {
  //     this.toastr.errorToastr("Oops! No data found", "Error", {
  //       toastTimeout: 2500
  //     });
  //   }
  // }

  //* -------------- Excel Export --------------
  // public download_Excel(xlsDataList) {
  //   alert("Excel Called");
  //   this.excelDataList = xlsDataList;

  //   if (xlsDataList.length > 0) {
  //     this.excelExportService.export(
  //       this.excelDataContent,
  //       new IgxExcelExporterOptions("DegreeCompleteExcel")
  //     );
  //     this.excelDataList = [];
  //   } else {
  //     this.toastr.errorToastr("Oops! No data found", "Error", {
  //       toastTimeout: 2500
  //     });
  //   }
  // }

  //************************ Function for change password *************************/
  changePassword() {
    if (this.txtCrntPassword == "") {
      this.toastr.errorToastr("Please Enter Old Password", "Oops!", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtNewPassword == "") {
      this.toastr.errorToastr("Please Enter New Password", "Oops!", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtCnfrmPassword == "") {
      this.toastr.errorToastr("Please Enter Comfirm Password", "Oops!", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtNewPassword != this.txtCnfrmPassword) {
      this.toastr.errorToastr("New Password doesn't match", "Oops!", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      this.showSpinner();
      var Token = localStorage.getItem(this.tokenKey);
      var reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Bearer " + Token,
      });

      var data = {
        indvdlID: this.empId,
        oldPassword: this.txtCrntPassword,
        newPassword: this.txtNewPassword,
      };

      this.http
        .post(this.serverUrl + "api/resetPassword", data, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg != "Password Changed Successfully!") {
            this.hideSpinner();
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 2500 });
            return false;
          } else {
            this.hideSpinner();
            this.toastr.successToastr(data.msg, "Success!", {
              toastTimeout: 5000,
            });
            this.txtCrntPassword = "";
            this.txtNewPassword = "";
            this.txtCnfrmPassword = "";
            return false;
          }
        });
    }
  }

  img =
    "data:image/png;base64,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";
}
