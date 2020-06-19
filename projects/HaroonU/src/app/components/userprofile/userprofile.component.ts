import {
  Component,
  OnInit,
  Injectable,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { Chart } from "angular-highcharts";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError, filter } from "rxjs/operators";
import { AppComponent } from "src/app/app.component";
import { TreeNode } from "../../nodeTree/TreeNode";
import { ActivatedRoute } from "@angular/router";
// import {
//   IgxExcelExporterOptions,
//   IgxExcelExporterService,
//   IgxGridComponent,
//   IgxCsvExporterService,
//   IgxCsvExporterOptions,
//   CsvFileTypes
// } from "igniteui-angular";

// import * as jsPDF from "jspdf";

declare var $: any;

///////////////////////////////////////////////////////////////////////////////
/*** Module Call : User Mangement ***/
/*** Page Call : UMIS(User Profile) ***/
/*** Screen No : 2.1 ***/
/*** Functionality : ***/
/*** 1 - Create User Login either Employee or External Party along with Defined Role ***/
/*** 2 - Reset User Password ***/
/*** 3 - View Application Role ***/
/*** 4 - Activate / DeActivate User ***/
/*** 5 - Updation of Users Login Profiles Credentials ***/
/*** 6 - Export into PDF, CSV, Excel ***/
/*** 7 - Send Link ***/
/*** 8 - Record Sorting ***/
/*** 9 - Filter multiple items ***/
/***10 - Generate Pin ***/
/***11 - Clear Fields ***/
/***12 - Assigning Chart data ***/
/*** Functions List :  ***/
/*** 1- getFilterItem(type) ***/
/*** 2- getParty() ***/
/*** 3- getUserDetail()  ***/
/*** 4- getUserTrend() ***/
/*** 5- getRoleTree()  ***/
/*** 6- getRole() ***/
/*** 7- resetPassword(item) ***/
/*** 8- activeUser(item) ***/
/*** 9- saveActiveUser() ***/
/***10- savePassword() ***/
/***11- saveEmployee() ***/
/***12- genPin() ***/
/***13- clear() ***/
/***14- edit(item, type) ***/
/***15- printDiv() ***/
/***16- downPDF() ***/
/***17- downloadCSV() ***/
/***18- downloadExcel() ***/
/***19- setOrder(value) ***/

@Component({
  selector: "app-userprofile",
  templateUrl: "./userprofile.component.html",
  styleUrls: ["./userprofile.component.scss"],
})
export class UserprofileComponent implements OnInit {
  /*** Api link published in server ***/
  serverUrl = "http://ambit-erp.southeastasia.cloudapp.azure.com:9037/";
  // serverUrl = "http://localhost:9037/";
  tokenKey = "token";

  /*** http header ***/
  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  /*** Variable Declaration ***/

  //* Variables Declaration for chart
  chart: Chart;

  //* List Declaration
  selectedRole: TreeNode[];
  roleTree: TreeNode[];
  roleList = [];
  tempRoleList = [];
  roleChildren = [];
  excelDataList = [];
  public users = [];
  public roles = [];
  userData = [];

  //* Variable Declaration for display values on page
  countAddition = 0;
  countUpdation = 0;
  countBanned = 0;
  partyEmail = "";
  partyFatherName = "";
  partyDepartment = "";
  partyBranch = "";
  partyAddress = "";
  lblIndvdlID = 0;
  lblFullName = "";
  lblEmail = "";
  lblJobDesigID = 0;
  lblJobPostDeptCd = 0;
  lblJobPostLocationCd = 0;
  isEmpty = true;

  cAdditions = [0, 0, 0, 0, 0, 0, 0];
  cUpdations = [0, 0, 0, 0, 0, 0, 0];
  cDeactivated = [0, 0, 0, 0, 0, 0, 0];

  //*Variable Declaration for NgModels
  tblSearch;
  txtPin = "";
  txtNewPassword = "";
  txtNewCnfrmPassword = "";
  userId = 0;
  userSearch = "";
  rdbType = "employee";
  searchEmployee = "";
  searchRole = "";
  txtUsername = "";
  txtPassword = "";
  txtCnfrmPassword = "";
  lblRoleName = "";
  cmbEmployee = "";
  cmbRole = "";
  chkPin = false;

  //* Variable Declaration for pagination and orderby pipe
  p = 1;
  order = "info.name";
  reverse = false;
  sortedCollection: any[];
  itemPerPage = "10";

  tempUserId;
  /*** Construction Function ***/
  constructor(
    private http: HttpClient,
    // private excelExportService: IgxExcelExporterService,
    // private csvExportService: IgxCsvExporterService,
    private app: AppComponent,
    public toastr: ToastrManager,
    private actRoute: ActivatedRoute
  ) {}

  /*** Page Initialization ***/
  ngOnInit() {
    //* Functions Call
    this.getUserTrendChart();

    //this.init();

    this.getUserDetail();
    this.getUserTrend();
    this.getParty();
    this.getRole();

    this.tempUserId = this.app.empId;
  }

  /*** Variable Declaration for exporting data to pdf  ***/
  // @ViewChild("excelDataContent") public excelDataContent: IgxGridComponent; //For excel
  @ViewChild("exportPDF") public exportPDF: ElementRef; // for pdf

  /***  Getting User Management chart data ***/
  init() {
    let chart = new Chart({
      chart: {
        type: "area",
      },
      credits: {
        enabled: false,
      },
      title: {
        text: "",
      },
      yAxis: {
        title: {
          text: "USER",
        },
      },
      series: [
        {
          name: "UPDATIONS",
          data: this.cUpdations,
        },
        {
          name: "DEACTIVATED",
          data: this.cDeactivated,
        },
        {
          name: "ADDITIONS",
          data: this.cAdditions,
        },
      ],
    });

    this.chart = chart;
  }

  /*** Getting User list filter method ***/

  getFilterItem(type) {
    return this.users.filter((x) => x.type == type);
  }

  /*** Getting User List who didn't have Application Access ***/
  getParty() {
    var itemBackup = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });
    // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + itemBackup });

    this.http
      .get(this.serverUrl + "api/getUsers", { headers: reqHeader })
      .subscribe((data: any) => {
        this.users = data;
      });
  }

  /*** get User List who have Application Access ***/

  getUserDetail() {
    this.app.showSpinner();
    var itemBackup = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });
    // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + itemBackup });

    this.http
      .get(this.serverUrl + "api/getUserDetail", { headers: reqHeader })
      .subscribe((data: any) => {
        this.userData = data;
        this.app.hideSpinner();
      });
  }

  /*** Get How many Users are Added, Modified and Blocked ***/
  getUserTrend() {
    this.app.showSpinner();
    var itemBackup = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });
    // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + itemBackup });

    this.http
      .get(this.serverUrl + "api/getUserTrends", { headers: reqHeader })
      .subscribe((data: any) => {
        //alert(data.addition)
        this.countAddition = data[0].addition;
        this.countUpdation = data[0].updation;
        this.countBanned = data[0].deactivated;

        this.app.hideSpinner();
      });
  }

  // Get specific role data and assign it to role tree list variable
  getRoleTree() {
    //*checking if role is empty
    if (this.cmbRole == "" || this.cmbRole == undefined) {
      this.toastr.errorToastr("Please Select User Role", "Oops!", {
        toastTimeout: 2500,
      });
      return;
    }

    //*loop for checking if role name is exist in role list
    for (var i = 0; i < this.roles.length; i++) {
      if (this.roles[i].erpRoleCd == this.cmbRole) {
        this.lblRoleName = this.roles[i].erpRoleName;
        i = this.roles.length + 1;
      }
    }

    this.app.showSpinner();
    this.roleTree = [];
    this.roleList = [];

    this.http
      .get(this.serverUrl + "api/getRoleTree?erpRoleCd=" + this.cmbRole)
      .subscribe((data: any) => {
        this.tempRoleList = data;

        for (var i = 0; i < this.tempRoleList.length; i++) {
          //*checking if type is module
          if (this.tempRoleList[i].erpObjctTypeCd == 1) {
            this.roleChildren = [];

            for (var j = 0; j < this.tempRoleList.length; j++) {
              //* checking if type is menu and parent id matched
              if (
                this.tempRoleList[j].erpObjctTypeCd == 2 &&
                this.tempRoleList[j].parentErpObjctCd ==
                  this.tempRoleList[i].erpObjctCd
              ) {
                this.roleChildren.push({
                  label: this.tempRoleList[j].erpObjctName,
                  data: [
                    {
                      objName: this.tempRoleList[j].erpObjctName,
                      typeCode: this.tempRoleList[j].erpObjctTypeCd,
                      objCode: this.tempRoleList[j].erpObjctCd,
                      parentErpObjCd: this.tempRoleList[i].erpObjctCd,
                      parentErpObjTypeCd: this.tempRoleList[i].erpObjctTypeCd,
                      parentErpObjName: this.tempRoleList[i].erpObjctName,
                    },
                  ],
                });
              }
            }

            this.roleList.push({
              label: this.tempRoleList[i].erpObjctName,
              data: [
                {
                  objName: this.tempRoleList[i].erpObjctName,
                  typeCode: this.tempRoleList[i].erpObjctTypeCd,
                  objCode: this.tempRoleList[i].erpObjctCd,
                },
              ],
              children: this.roleChildren,
            });
          }
        }

        this.roleTree = this.roleList;

        this.app.hideSpinner();
      });
    $("#permissionModal").modal("show");
  }

  // Get data for user trend chart
  getUserTrendChart() {
    this.app.showSpinner();

    this.http
      .get(this.serverUrl + "api/getUserTrendsChart")
      .subscribe((data: any) => {
        //this.tempRoleList = data;
        this.cAdditions = [];
        this.cUpdations = [];
        this.cDeactivated = [];

        for (var i = 0; i < data.length; i++) {
          this.cAdditions.push(data[i].addition);

          this.cUpdations.push(data[i].updation);

          this.cDeactivated.push(data[i].deactivated);
        }

        this.app.hideSpinner();
        this.init();
      });
  }

  /*** Application Roles List ***/
  getRole() {
    var itemBackup = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });
    // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + itemBackup });

    this.http
      .get(this.serverUrl + "api/getRoles", { headers: reqHeader })
      .subscribe((data: any) => {
        this.roles = data;
      });
  }

  /*** Empty and Assign data to fields. Also show modal window ***/
  resetPassword(item) {
    this.isEmpty = true;
    this.txtNewPassword = "";
    this.txtNewCnfrmPassword = "";

    this.lblIndvdlID = item.indvdlID;
    this.lblFullName = item.indvdlFullName;
    this.lblEmail = item.emailAddrss;

    $("#resetModal").modal("show");
  }

  /*** Empty and Assign data to fields. Also show modal window ***/
  activeUser(item) {
    this.txtPin = "";

    this.lblIndvdlID = item.indvdlID;

    $("#activeUserModal").modal("show");
  }

  /*** Activate / DeActivate User ***/
  saveActiveUser() {
    //* checking if Pin is empty
    if (this.txtPin == "") {
      this.toastr.errorToastr("Please Enter Pin", "Oops!", {
        toastTimeout: 2500,
      });
      return false;
    }
    this.app.showSpinner();
    var Token = localStorage.getItem(this.tokenKey);
    // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    //* Initialize List and Assign data to list. Sending list to api
    var data = {
      IndvdlID: this.lblIndvdlID,
      CrntUserLogin: localStorage.getItem("userName"),
      CrntUserPin: this.txtPin,
      ConnectedUser: this.app.empId,
    };

    this.http
      .post(this.serverUrl + "api/activeUser", data, { headers: reqHeader })
      .subscribe((data: any) => {
        //* checking if user activate or deactivate
        if (
          data.msg != "User Deactivated Successfully!" &&
          data.msg != "User Activated Successfully!"
        ) {
          this.app.hideSpinner();
          this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 2500 });
          return false;
        } else {
          this.app.hideSpinner();
          this.toastr.successToastr(data.msg, "Success!", {
            toastTimeout: 5000,
          });
          this.getUserDetail();
          this.getUserTrend();
          this.getParty();
          this.getUserTrendChart();
          $("#activeUserModal").modal("hide");
          this.txtPin = "";
          return false;
        }
      });
  }

  /*** Reset User's Password  ***/
  savePassword() {
    //* checking if New Password is empty
    if (this.txtNewPassword == "") {
      this.toastr.errorToastr("Please Enter New Password", "Oops!", {
        toastTimeout: 2500,
      });
      return false;
    }
    //* checking if Confirm Password is empty
    else if (this.txtNewCnfrmPassword == "") {
      this.toastr.errorToastr("Please Enter Confirm Password", "Oops!", {
        toastTimeout: 2500,
      });
      return false;
    }
    //* checking if New Password And Confirm Password not matched
    else if (this.txtNewPassword != this.txtNewCnfrmPassword) {
      this.toastr.errorToastr("New Password doesn't match", "Oops!", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      this.app.showSpinner();
      var Token = localStorage.getItem(this.tokenKey);
      // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      //* Initialize List and Assign data to list. Sending list to api
      var data = {
        indvdlID: this.lblIndvdlID,
        Email: this.lblEmail,
        IndvdlERPPsswrd: this.txtNewPassword,
        ConnectedUser: this.app.empId,
      };

      this.http
        .post(this.serverUrl + "api/resetPassword", data, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          //* checking if mail not sent
          if (data.msg != "Mail Sent!") {
            this.app.hideSpinner();
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 2500 });
            return false;
          } else {
            this.app.hideSpinner();
            this.toastr.successToastr(data.msg, "Success!", {
              toastTimeout: 5000,
            });
            this.txtNewPassword = "";
            this.txtNewCnfrmPassword = "";
            $("#resetModal").modal("hide");
            return false;
          }
        });
    }
  }

  /***  Updation of User's Login Profile Credentials ***/
  saveEmployee() {
    var type = "";
    //* pin checkbox is not checked
    if (this.chkPin == false) {
      type = "2";
    } else {
      type = "1";
    }

    //*checking if type is empty
    if (this.rdbType == "") {
      this.toastr.errorToastr("Please select user type", "Error", {
        toastTimeout: 2500,
      });
      return false;
    }
    //*checking if type is employee or visitor
    else if (this.rdbType == "Employee" || this.rdbType == "Visitor") {
      //*checking if employee is empty
      if (this.cmbEmployee == "") {
        this.toastr.errorToastr("Please select user", "Error", {
          toastTimeout: 2500,
        });
        return false;
      }
      //*checking if login name is empty
      else if (this.txtUsername.trim().length == 0) {
        this.toastr.errorToastr("Please enter user name", "Error", {
          toastTimeout: 2500,
        });
        return false;
      }
      //*checking if password is empty
      else if (this.txtPassword.trim().length == 0) {
        this.toastr.errorToastr("Please enter password", "Error", {
          toastTimeout: 2500,
        });
        return false;
      }
      //*checking if password and confirm password not matched
      else if (this.txtPassword != this.txtCnfrmPassword) {
        this.toastr.errorToastr(
          "Your password and confirmation password does not match",
          "Error",
          { toastTimeout: 2500 }
        );
        return false;
      }
      //*checking if role is empty
      else if (this.cmbRole == "") {
        this.toastr.errorToastr("Please select user role", "Error", {
          toastTimeout: 2500,
        });
        return false;
      } else {
        this.app.showSpinner();

        //* Initialize List and Assign data to list. Sending list to api
        var data = {
          IndvdlID: this.userId,
          JobDesigID: this.lblJobDesigID,
          JobPostDeptCd: this.lblJobPostDeptCd,
          JobPostLocationCd: this.lblJobPostLocationCd,
          IndvdlERPUsrID: this.txtUsername,
          IndvdlERPPsswrd: this.txtPassword,
          ERPRoleCd: this.cmbRole,
          Type: this.rdbType,
          ERPPINStatCd: type,
          ConnectedUser: this.app.empId,
          DelFlag: 0,
        };

        var token = localStorage.getItem(this.tokenKey);

        // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

        this.http
          .put(this.serverUrl + "api/updateUser", data, { headers: reqHeader })
          .subscribe((data: any) => {
            //* checking if user not updated
            if (data.msg != "User Created Successfully!") {
              this.app.hideSpinner();
              this.toastr.errorToastr(data.msg, "Error!", {
                toastTimeout: 2500,
              });
              return false;
            } else {
              this.app.hideSpinner();
              this.getUserDetail();
              this.getUserTrend();
              this.getParty();
              this.toastr.successToastr(data.msg, "Success!", {
                toastTimeout: 2500,
              });
              $("#userModal").modal("hide");
              this.clear();
              return false;
            }
          });
      }
    }
  }

  /*** Pin Initialization***/
  genPin() {
    this.app.sendPin();
  }

  /*** Empty All Fields in page ***/
  clear() {
    this.userId = 0;
    this.txtUsername = "";
    this.partyFatherName = "";
    this.partyEmail = "";
    this.partyDepartment = "";
    this.partyBranch = "";
    this.partyAddress = "";
    this.cmbEmployee = "";
    this.rdbType = "";
    this.txtPassword = "";
    this.txtCnfrmPassword = "";
    this.cmbRole = "";
    this.lblJobDesigID = 0;
    this.lblJobPostDeptCd = 0;
    this.lblJobPostLocationCd = 0;
    this.chkPin = false;
    this.isEmpty = true;
  }

  /*** Assign values to variables for Updation ***/

  edit(item, actionType) {
    if (actionType == "block") {
      this.userId = item.indvdlId;
    } else if (actionType == "link") {
      this.userId = item.indvdlID;
      this.partyEmail = item.emailAddrss;
      this.partyFatherName = item.indvdlFatherName;
      this.partyDepartment = item.deptName;
      this.partyBranch = item.locationName;
      this.partyAddress = item.address;
      this.lblJobDesigID = item.jobDesigID;
      this.lblJobPostDeptCd = item.jobPostDeptCd;
      this.lblJobPostLocationCd = item.jobPostLocationCd;
    }
  }

  /*** For Print Purpose ***/

  printDiv() {
    // var commonCss = ".commonCss{font-family: Arial, Helvetica, sans-serif; text-align: center; }";

    // var cssHeading = ".cssHeading {font-size: 25px; font-weight: bold;}";
    // var cssAddress = ".cssAddress {font-size: 16px; }";
    // var cssContact = ".cssContact {font-size: 16px; }";

    // var tableCss = "table {width: 100%; border-collapse: collapse;}    table thead tr th {text-align: left; font-family: Arial, Helvetica, sans-serif; font-weight: bole; border-bottom: 1px solid black; margin-left: -3px;}     table tbody tr td {font-family: Arial, Helvetica, sans-serif; border-bottom: 1px solid #ccc; margin-left: -3px; height: 33px;}";

    // var printCss = commonCss + cssHeading + cssAddress + cssContact + tableCss;

    var printCss = this.app.printCSS();

    //printCss = printCss + "";

    var contents = $("#printArea").html();

    var frame1 = $("<iframe />");
    frame1[0].name = "frame1";
    frame1.css({ position: "absolute", top: "-1000000px" });
    $("body").append(frame1);
    var frameDoc = frame1[0].contentWindow
      ? frame1[0].contentWindow
      : frame1[0].contentDocument.document
      ? frame1[0].contentDocument.document
      : frame1[0].contentDocument;
    frameDoc.document.open();

    //Create a new HTML document.
    frameDoc.document.write(
      "<html><head><title>DIV Contents</title>" +
        "<style>" +
        printCss +
        "</style>"
    );

    //Append the external CSS file.  <link rel="stylesheet" href="../../../styles.scss" />  <link rel="stylesheet" href="../../../../node_modules/bootstrap/dist/css/bootstrap.min.css" />
    frameDoc.document.write(
      '<style type="text/css" media="print">/*@page { size: landscape; }*/</style>'
    );

    frameDoc.document.write("</head><body>");

    //Append the DIV contents.
    frameDoc.document.write(contents);
    frameDoc.document.write("</body></html>");

    frameDoc.document.close();

    //alert(frameDoc.document.head.innerHTML);
    // alert(frameDoc.document.body.innerHTML);

    setTimeout(function () {
      window.frames["frame1"].focus();
      window.frames["frame1"].print();
      frame1.remove();
    }, 500);
  }

  /*** For PDF Download ***/
  downPDF() {
    // let doc = new jsPDF();
    // let specialElementHandlers = {
    //   "#editor": function(element, renderer) {
    //     return true;
    //   }
    // };
    // let content = this.exportPDF.nativeElement;
    // doc.fromHTML(content.innerHTML, 15, 15, {
    //   width: 190,
    //   "elementHandlers ": specialElementHandlers
    // });
    // doc.save("testabc.pdf");
  }

  /*** For CSV File ***/

  // public downloadCSV() {
  //   // case 1: When userSearch is empty then assign full data list
  //   if (this.userSearch == "") {
  //     var completeDataList = [];
  //     for (var i = 0; i < this.userData.length; i++) {
  //       completeDataList.push({
  //         userName: this.userData[i].uName,
  //         email: this.userData[i].uEmail,
  //         role: this.userData[i].uRole,
  //         userSince: this.userData[i].uSince,
  //         lastLogin: this.userData[i].lastLogin
  //       });
  //     }
  //     this.csvExportService.exportData(
  //       completeDataList,
  //       new IgxCsvExporterOptions("UserProfileCompleteCSV", CsvFileTypes.CSV)
  //     );
  //   }
  //   // case 2: When userSearch is not empty then assign new data list
  //   else if (this.userSearch != "") {
  //     var filteredDataList = [];
  //     for (var i = 0; i < this.userData.length; i++) {
  //       if (
  //         this.userData[i].uName
  //           .toUpperCase()
  //           .includes(this.userSearch.toUpperCase()) ||
  //         this.userData[i].uEmail
  //           .toUpperCase()
  //           .includes(this.userSearch.toUpperCase()) ||
  //         this.userData[i].uRole
  //           .toUpperCase()
  //           .includes(this.userSearch.toUpperCase()) ||
  //         this.userData[i].uSince
  //           .toUpperCase()
  //           .includes(this.userSearch.toUpperCase()) ||
  //         this.userData[i].lastLogin
  //           .toUpperCase()
  //           .includes(this.userSearch.toUpperCase())
  //       ) {
  //         filteredDataList.push({
  //           userName: this.userData[i].uName,
  //           email: this.userData[i].uEmail,
  //           role: this.userData[i].uRole,
  //           userSince: this.userData[i].uSince,
  //           lastLogin: this.userData[i].lastLogin
  //         });
  //       }
  //     }

  //     if (filteredDataList.length > 0) {
  //       this.csvExportService.exportData(
  //         filteredDataList,
  //         new IgxCsvExporterOptions("UserProfileFilterCSV", CsvFileTypes.CSV)
  //       );
  //     } else {
  //       this.toastr.errorToastr("Oops! No data found", "Error", {
  //         toastTimeout: 2500
  //       });
  //     }
  //   }
  // }

  /*** For Exce File ***/
  // public downloadExcel() {
  //   // case 1: When userSearch is empty then assign full data list
  //   if (this.userSearch == "") {
  //     for (var i = 0; i < this.userData.length; i++) {
  //       this.excelDataList.push({
  //         userName: this.userData[i].uName,
  //         email: this.userData[i].uEmail,
  //         role: this.userData[i].uRole,
  //         userSince: this.userData[i].uSince,
  //         lastLogin: this.userData[i].lastLogin
  //       });
  //     }

  //     this.excelExportService.export(
  //       this.excelDataContent,
  //       new IgxExcelExporterOptions("UserProfileCompleteExcel")
  //     );
  //     this.excelDataList = [];
  //   }
  //   // case 2: When userSearch is not empty then assign new data list
  //   else if (this.userSearch != "") {
  //     for (var i = 0; i < this.userData.length; i++) {
  //       if (
  //         this.userData[i].uName
  //           .toUpperCase()
  //           .includes(this.userSearch.toUpperCase()) ||
  //         this.userData[i].uEmail
  //           .toUpperCase()
  //           .includes(this.userSearch.toUpperCase()) ||
  //         this.userData[i].uRole
  //           .toUpperCase()
  //           .includes(this.userSearch.toUpperCase()) ||
  //         this.userData[i].uSince
  //           .toUpperCase()
  //           .includes(this.userSearch.toUpperCase()) ||
  //         this.userData[i].lastLogin
  //           .toUpperCase()
  //           .includes(this.userSearch.toUpperCase())
  //       ) {
  //         this.excelDataList.push({
  //           userName: this.userData[i].uName,
  //           email: this.userData[i].uEmail,
  //           role: this.userData[i].uRole,
  //           userSince: this.userData[i].uSince,
  //           lastLogin: this.userData[i].lastLogin
  //         });
  //       }
  //     }

  //     if (this.excelDataList.length > 0) {
  //       this.excelExportService.export(
  //         this.excelDataContent,
  //         new IgxExcelExporterOptions("UserProfileFilterExcel")
  //       );
  //       this.excelDataList = [];
  //     } else {
  //       this.toastr.errorToastr("Oops! No data found", "Error", {
  //         toastTimeout: 2500
  //       });
  //     }
  //   }
  // }

  /***function for sort table data ***/

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  showPasswordStrenght(item) {
    if (item != "") {
      this.isEmpty = false;
    } else {
      this.isEmpty = true;
    }
  }
}
