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
//     IgxExcelExporterOptions,
//     IgxExcelExporterService,
//     IgxGridComponent,
//     IgxCsvExporterService,
//     IgxCsvExporterOptions,
//     CsvFileTypes
// } from "igniteui-angular";

// import * as jsPDF from 'jspdf';
declare var $: any;

@Component({
  selector: "app-rpt-user",
  templateUrl: "./rpt-user.component.html",
  styleUrls: ["./rpt-user.component.scss"],
})
export class RptUserComponent implements OnInit {
  serverUrl = "http://ambit-erp.southeastasia.cloudapp.azure.com:9037/";
  // serverUrl = "http://localhost:5000/";
  tokenKey = "token";

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  // list for excel data
  excelDataList = [];

  chart: Chart;
  eName = "";

  tblSearch;
  toDate;

  cmbDepartment;

  roleTree: TreeNode[];
  roleList = [];
  tempRoleList = [];
  roleChildren = [];

  selectedRole: TreeNode[];
  //* variables for display values on page
  countAddition = 0;
  countUpdation = 0;
  countBanned = 0;
  partyEmail = "";
  partyFatherName = "";
  partyDepartment = "";
  partyBranch = "";
  partyAddress = "";
  userLink = "";
  userLinkCode = "";
  lblIndvdlID = 0;
  lblFullName = "";
  lblEmail = "";
  lblJobDesigID = 0;
  lblJobPostDeptCd = 0;
  lblJobPostLocationCd = 0;
  txtPin = "";

  txtNewPassword = "";
  txtNewCnfrmPassword = "";

  //*Variables for NgModels
  searchAction = "";
  txtActionPassword = "";
  txtActionPIN = "";
  userId = 0;
  userSearch = "";
  rdbType = "employee";
  searchEmployee = "";
  searchRole = "";
  txtUsername = "";
  txtPassword = "";
  txtCnfrmPassword = "";
  lblRoleName = "";

  //*Boolean ng models and variables
  chkPin = false;
  showLink = false;
  actionPassRow = false;
  actionPINCodeRow = false;
  actionBlockRow = false;

  //* variables for pagination and orderby pipe
  p = 1;
  order = "info.name";
  reverse = false;
  sortedCollection: any[];
  itemPerPage = "10";

  //List variables
  public users = [];
  public roles = [];
  listAction = "";
  listBlockedAction = "";
  cmbEmployee = "";
  cmbRole = "";

  userData = [];

  constructor(
    private http: HttpClient,
    // private excelExportService: IgxExcelExporterService,
    // private csvExportService: IgxCsvExporterService,
    private app: AppComponent,
    public toastr: ToastrManager,
    private actRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getUserDetail();
    this.getUserTrend();
    this.getParty();
    this.getRole();

    this.toDate = new Date();
  }

  // @ViewChild("excelDataContent") public excelDataContent: IgxGridComponent;//For excel
  @ViewChild("exportPDF") public exportPDF: ElementRef; // for pdf

  //party list filter method
  getFilterItem(type) {
    // this.cmbEmployee = '';
    // this.partyFatherName = '';
    // this.partyEmail = '';
    // this.partyAddress = '';
    // this.partyBranch = '';
    // this.partyDepartment = '';

    return this.users.filter((x) => x.type == type);
  }

  //get partys function
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

  //get partys function
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

  //get partys function
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

  //getting specific role data and assign it to role tree
  getRoleTree() {
    if (this.cmbRole == "" || this.cmbRole == undefined) {
      this.toastr.errorToastr("Please Select User Role", "Oops!", {
        toastTimeout: 2500,
      });
      return;
    }

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
        // this.employees = data;

        for (var i = 0; i < this.tempRoleList.length; i++) {
          //checking if type is module
          if (this.tempRoleList[i].erpObjctTypeCd == 1) {
            this.roleChildren = [];

            for (var j = 0; j < this.tempRoleList.length; j++) {
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

  //get Roles function
  getRole() {
    var itemBackup = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });
    // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + itemBackup });

    this.http
      .get(this.serverUrl + "api/getRoles", { headers: reqHeader })
      .subscribe((data: any) => {
        for (var i = 0; i < data.length; i++) {
          this.roles.push({
            label: data[i].erpRoleName,
            varue: i,
            //value: data[i].erpRoleName
          });
        }
      });
  }

  resetPassword(item) {
    this.txtNewPassword = "";
    this.txtNewCnfrmPassword = "";

    this.lblIndvdlID = item.indvdlID;
    this.lblFullName = item.indvdlFullName;
    this.lblEmail = item.emailAddrss;

    $("#resetModal").modal("show");
  }

  activeUser(item) {
    this.txtPin = "";

    this.lblIndvdlID = item.indvdlID;
    // this.lblFullName = item.indvdlFullName;
    // this.lblEmail = item.emailAddrss;

    $("#activeUserModal").modal("show");
  }

  saveActiveUser() {
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

    var data = {
      IndvdlID: this.lblIndvdlID,
      CrntUserLogin: localStorage.getItem("userName"),
      CrntUserPin: this.txtPin,
      ConnectedUser: this.app.empId,
    };

    this.http
      .post(this.serverUrl + "api/activeUser", data, { headers: reqHeader })
      .subscribe((data: any) => {
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
          $("#activeUserModal").modal("hide");
          this.txtPin = "";
          return false;
        }
      });
  }

  savePassword() {
    if (this.txtNewPassword == "") {
      this.toastr.errorToastr("Please Enter New Password", "Oops!", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtNewCnfrmPassword == "") {
      this.toastr.errorToastr("Please Enter Comfirm Password", "Oops!", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtNewPassword != this.txtNewCnfrmPassword) {
      this.toastr.errorToastr("New Password doesn't match", "Oops!", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      this.app.showSpinner();
      var Token = localStorage.getItem(this.tokenKey);
      // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

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

  //bloock, delete and generate pin for user
  saveAction() {
    if (this.listAction == "") {
      this.toastr.errorToastr("Please Select Action Type", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      if (this.listAction == "Block" && this.listBlockedAction == "") {
        //this.isLoginError = true;
        this.toastr.errorToastr("Please Select Block Time", "Error", {
          toastTimeout: 2500,
        });
        return false;
      } else if (this.txtActionPassword == "") {
        //this.isLoginError = true;
        this.toastr.errorToastr("Please Enter Password", "Error", {
          toastTimeout: 2500,
        });
        return false;
      } else if (this.txtActionPIN == "") {
        this.toastr.errorToastr("Please Enter PIN Code", "Error", {
          toastTimeout: 2500,
        });
        return false;
      } else {
        this.app.showSpinner();
        this.app.hideSpinner();

        var data = {
          empId: this.userId,
          action: this.listAction,
          duration: this.listBlockedAction,
          password: this.txtActionPassword,
          pin: this.txtActionPIN,
        };

        var token = localStorage.getItem(this.tokenKey);

        var reqHeader = new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        });

        return this.http
          .post(this.serverUrl + "api/action", data, { headers: reqHeader })
          .subscribe((data: any) => {
            if (data.msg != undefined) {
              this.toastr.errorToastr(data.msg, "Error!", {
                toastTimeout: 2500,
              });
              return false;
            } else {
              this.toastr.successToastr(data.msg, "Success!", {
                toastTimeout: 2500,
              });
              $("#actionModal").modal("hide");
              return false;
            }
          });
      }
    }
  }

  //create user name and password for party and send user name password
  saveEmployee() {
    var type = "";
    if (this.chkPin == false) {
      type = "2";
    } else {
      type = "1";
    }

    if (this.rdbType == "") {
      this.toastr.errorToastr("Please select user type", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.rdbType == "Employee" || this.rdbType == "Visitor") {
      if (this.cmbEmployee == "") {
        this.toastr.errorToastr("Please select user", "Error", {
          toastTimeout: 2500,
        });
        return false;
      } else if (this.txtUsername.trim().length == 0) {
        this.toastr.errorToastr("Please enter user name", "Error", {
          toastTimeout: 2500,
        });
        return false;
      } else if (this.txtPassword.trim().length == 0) {
        this.toastr.errorToastr("Please enter password", "Error", {
          toastTimeout: 2500,
        });
        return false;
      } else if (this.txtPassword != this.txtCnfrmPassword) {
        this.toastr.errorToastr(
          "Your password and confirmation password does not match",
          "Error",
          { toastTimeout: 2500 }
        );
        return false;
      } else if (this.cmbRole == "") {
        this.toastr.errorToastr("Please select user role", "Error", {
          toastTimeout: 2500,
        });
        return false;
      } else {
        this.app.showSpinner();

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

  genPin() {
    this.app.sendPin();
  }
  //if you want to clear input
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
  }

  //on Employee change model and action btn click
  edit(item, actionType) {
    if (actionType == "block") {
      this.userId = item.indvdlId;
    } else if (actionType == "link") {
      this.userId = item.indvdlID;
      // this.userLink = "localhost:4200?code=";
      // this.userLinkCode = btoa(this.userId + "");

      this.partyEmail = item.emailAddrss;
      this.partyFatherName = item.indvdlFatherName;
      this.partyDepartment = item.deptName;
      this.partyBranch = item.locationName;
      this.partyAddress = item.address;
      this.lblJobDesigID = item.jobDesigID;
      this.lblJobPostDeptCd = item.jobPostDeptCd;
      this.lblJobPostLocationCd = item.jobPostLocationCd;

      this.showLink = true;
    }
  }

  // For Print Purpose
  printDiv() {
    var printCss = this.app.printCSS();

    //printCss = printCss + "";
    $(".hideContent").hide();

    var contents = $("#sampleReport").html();

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
    frameDoc.document.write(
      '<link rel="stylesheet" href="../../../assets/styles.css" type="text/css"  media="print"/>'
    );
    frameDoc.document.write("</head><body>");

    //Append the DIV contents.
    frameDoc.document.write(contents);
    frameDoc.document.write("</body></html>");

    frameDoc.document.close();

    setTimeout(function () {
      window.frames["frame1"].focus();
      window.frames["frame1"].print();
      frame1.remove();
    }, 500);

    $(".hideContent").show();
  }

  downPDF() {
    // let doc = new jsPDF();
    // let specialElementHandlers = {
    //     '#editor': function (element, renderer) {
    //         return true;
    //     }
    // }
    // let content = this.exportPDF.nativeElement;
    // doc.fromHTML(content.innerHTML, 15, 15, {
    //     'width': 190,
    //     'elementHandlers ': specialElementHandlers
    // });
    // doc.save('testabc.pdf');
  }

  //For CSV File
  // public downloadCSV() {
  //     // case 1: When userSearch is empty then assign full data list
  //     if (this.userSearch == "") {
  //         var completeDataList = [];
  //         for (var i = 0; i < this.userData.length; i++) {
  //             completeDataList.push({
  //                 userName: this.userData[i].uName,
  //                 email: this.userData[i].uEmail,
  //                 role: this.userData[i].uRole,
  //                 userSince: this.userData[i].uSince,
  //                 lastLogin: this.userData[i].lastLogin
  //             });
  //         }
  //         this.csvExportService.exportData(completeDataList, new IgxCsvExporterOptions("UserProfileCompleteCSV", CsvFileTypes.CSV));
  //     }
  //     // case 2: When userSearch is not empty then assign new data list
  //     else if (this.userSearch != "") {
  //         var filteredDataList = [];
  //         for (var i = 0; i < this.userData.length; i++) {

  //             if (this.userData[i].uName.toUpperCase().includes(this.userSearch.toUpperCase()) ||
  //                 this.userData[i].uEmail.toUpperCase().includes(this.userSearch.toUpperCase()) ||
  //                 this.userData[i].uRole.toUpperCase().includes(this.userSearch.toUpperCase()) ||
  //                 this.userData[i].uSince.toUpperCase().includes(this.userSearch.toUpperCase()) ||
  //                 this.userData[i].lastLogin.toUpperCase().includes(this.userSearch.toUpperCase())) {
  //                 filteredDataList.push({
  //                     userName: this.userData[i].uName,
  //                     email: this.userData[i].uEmail,
  //                     role: this.userData[i].uRole,
  //                     userSince: this.userData[i].uSince,
  //                     lastLogin: this.userData[i].lastLogin
  //                 });
  //             }
  //         }

  //         if (filteredDataList.length > 0) {
  //             this.csvExportService.exportData(filteredDataList, new IgxCsvExporterOptions("UserProfileFilterCSV", CsvFileTypes.CSV));
  //         }
  //         else {
  //             this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
  //         }
  //     }
  // }

  //For Exce File
  // public downloadExcel() {
  //     // case 1: When userSearch is empty then assign full data list
  //     if (this.userSearch == "") {
  //         for (var i = 0; i < this.userData.length; i++) {
  //             this.excelDataList.push({
  //                 userName: this.userData[i].uName,
  //                 email: this.userData[i].uEmail,
  //                 role: this.userData[i].uRole,
  //                 userSince: this.userData[i].uSince,
  //                 lastLogin: this.userData[i].lastLogin
  //             });
  //         }

  //         this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("UserProfileCompleteExcel"));
  //         this.excelDataList = [];
  //     }
  //     // case 2: When userSearch is not empty then assign new data list
  //     else if (this.userSearch != "") {

  //         for (var i = 0; i < this.userData.length; i++) {
  //             if (this.userData[i].uName.toUpperCase().includes(this.userSearch.toUpperCase()) ||
  //                 this.userData[i].uEmail.toUpperCase().includes(this.userSearch.toUpperCase()) ||
  //                 this.userData[i].uRole.toUpperCase().includes(this.userSearch.toUpperCase()) ||
  //                 this.userData[i].uSince.toUpperCase().includes(this.userSearch.toUpperCase()) ||
  //                 this.userData[i].lastLogin.toUpperCase().includes(this.userSearch.toUpperCase())) {
  //                 this.excelDataList.push({
  //                     userName: this.userData[i].uName,
  //                     email: this.userData[i].uEmail,
  //                     role: this.userData[i].uRole,
  //                     userSince: this.userData[i].uSince,
  //                     lastLogin: this.userData[i].lastLogin
  //                 });
  //             }
  //         }

  //         if (this.excelDataList.length > 0) {

  //             this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("UserProfileFilterExcel"));
  //             this.excelDataList = [];

  //         }
  //         else {
  //             this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
  //         }
  //     }
  // }

  // On Action Change Modal Window Combo Box
  onActionChange() {
    // When user selects "Delete" in the Combo Box
    if (this.listAction == "Delete") {
      this.actionBlockRow = false;
      this.actionPassRow = true;
      this.actionPINCodeRow = true;
      //Clear Text Boxes
      this.txtActionPassword = "";
      this.txtActionPIN = "";
    }
    // When user selects "Block" in the Combo Box
    else if (this.listAction == "Block") {
      this.actionBlockRow = true;
      this.actionPassRow = true;
      this.actionPINCodeRow = true;
      //Clear Text Boxes
      this.listBlockedAction = "";
      this.txtActionPassword = "";
      this.txtActionPIN = "";
    }
    // When user selects "Generate PIN" in the Combo Box
    else if (this.listAction == "Generate PIN") {
      this.actionBlockRow = false;
      this.actionPassRow = true;
      this.actionPINCodeRow = false;
      //Clear Text Boxes
      this.listBlockedAction = "";
      this.txtActionPassword = "";
      this.txtActionPIN = "";
    } else {
      return false;
    }
  }

  //create user name and password for party and send user name password
  sendLink() {
    if (this.rdbType == "") {
      this.toastr.errorToastr("Please select user type", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.rdbType == "employee" || this.rdbType == "visitor") {
      if (this.cmbEmployee == "") {
        this.toastr.errorToastr("Please select user", "Error", {
          toastTimeout: 2500,
        });
        return false;
      } else {
        this.app.showSpinner();
        this.app.hideSpinner();

        var data = { partyId: this.userId };

        var token = localStorage.getItem(this.tokenKey);

        var reqHeader = new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        });

        this.http
          .put(this.serverUrl + "api/pwCreate", data, { headers: reqHeader })
          .subscribe((data: any) => {
            if (data.msg != undefined) {
              this.toastr.errorToastr(data.msg, "Error!", {
                toastTimeout: 2500,
              });
              return false;
            } else {
              this.toastr.successToastr(
                "Record Inserted Successfully",
                "Success!",
                { toastTimeout: 2500 }
              );
              $("#actionModal").modal("hide");
              return false;
            }
          });
      }
    } else {
      return false;
    }
  }

  //*function for sort table data
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }
}
