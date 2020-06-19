import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError, filter } from "rxjs/operators";
import { allSettled } from "q";
import { AppComponent } from "../../../../../../src/app/app.component";
// import * as jsPDF from 'jspdf';
// import {
//   IgxExcelExporterOptions,
//   IgxExcelExporterService,
//   IgxGridComponent,
//   IgxCsvExporterService,
//   IgxCsvExporterOptions,
//   CsvFileTypes
// } from "igniteui-angular";

//----------------------------------------------------------------------------//
//-------------------Working of this typescript file are as follows-----------//
//-------------------Getting section data into main table -------------------//
//-------------------Add new section into database --------------------------//
//-------------------Update section into database ---------------------------//
//-------------------Delete section from database ---------------------------//
//-------------------Export into PDF, CSV, Excel -----------------------------//
//-------------------For sorting the record-----------------------------//
//----------------------------------------------------------------------------//

declare var $: any;

@Component({
  selector: "app-section",
  templateUrl: "./section.component.html",
  styleUrls: ["./section.component.scss"],
})
export class SectionComponent implements OnInit {
  serverUrl = "http://ambit-erp.southeastasia.cloudapp.azure.com:9042/";
  // serverUrl = "http://localhost:7003/";
  tokenKey = "token";

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  //list variables
  companyList = [];
  branchList = [];
  locationList = [];
  departmentList = [];
  sectionList = [];
  departmentDetailsList = [];
  selectedBranchList = [];

  //dropdown search ng-models
  ddlSearchCompany = "";
  tblSearch = "";
  sectHeading = "Add";
  // Add Department Details NgModels
  sectionId = "";
  departmentId = 0;
  ddlCompany = "0";
  sectionName = "";

  //* variables for pagination and orderby pipe
  p = 1;
  pDept = 1;
  order = "info.name";
  reverse = false;
  sortedCollection: any[];
  itemPerPage = "10";
  itemPerPageDept = "5";

  constructor(
    private toastr: ToastrManager,
    private app: AppComponent,
    private http: HttpClient
  ) // private excelExportService: IgxExcelExporterService,
  // private csvExportService: IgxCsvExporterService
  {}

  ngOnInit() {
    this.getCompany();
    this.getLocation();
    this.getDepartment();
    this.getSection();
    this.getSectionDetails();
  }

  // // @ViewChild("excelDataContent") public excelDataContent: IgxGridComponent; //For excel
  @ViewChild("exportPDF") public exportPDF: ElementRef;

  //******************** get companys list
  getCompany() {
    //return false;

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getCompany", { headers: reqHeader })
      .subscribe((data: any) => {
        this.companyList = data;
      });
  }

  //******************** To get departments
  getLocation() {
    //return false;

    var Token = localStorage.getItem(this.tokenKey);
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "api/getBranch", { headers: reqHeader })
      .subscribe((data: any) => {
        this.branchList = data;
      });
  }

  //******************** To get departments
  getDepartment() {
    var Token = localStorage.getItem(this.tokenKey);
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "api/getDepartment", { headers: reqHeader })
      .subscribe((data: any) => {
        this.departmentList = data;
      });
  }

  //******************** To get section
  getSection() {
    var Token = localStorage.getItem(this.tokenKey);
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + Token,
    });

    this.app.showSpinner();

    this.http
      .get(this.serverUrl + "api/getSection", { headers: reqHeader })
      .subscribe((data: any) => {
        this.sectionList = data;
        this.app.hideSpinner();
      });
  }

  //******************** To get section details for display in main table
  getSectionDetails() {
    var Token = localStorage.getItem(this.tokenKey);
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + Token,
    });

    this.app.showSpinner();

    this.http
      .get(this.serverUrl + "api/getSectionDetail", { headers: reqHeader })
      .subscribe((data: any) => {
        this.departmentDetailsList = data;
        this.app.hideSpinner();
      });
  }

  //******************** generating pin
  generatePin(item) {
    if (this.app.pin != "") {
      if (item.delFlag == false) {
        item.delFlag = true;
      } else if (item.delFlag == true) {
        item.delFlag = false;
      }
    }

    // alert(item.sectCd);
    //* check if global variable is empty
    if (this.app.pin != "") {
      //* Initialize List and Assign data to list. Sending list to api
      this.app.showSpinner();

      var deptData = {
        sectionCd: item.sectCd,
        deptCd: item.deptCd,
        companyId: item.companyId,
        sectionName: item.sectionName,
        branch: JSON.stringify(this.selectedBranchList),
        DelFlag: item.delFlag,
        connectedUser: 12000,
      };

      this.http
        .put(this.serverUrl + "api/deleteSection", deptData)
        .subscribe((data: any) => {
          if (
            data.msg != "Section Successfully Activated!" &&
            data.msg != "Section Successfully Deactivated!"
          ) {
            this.app.hideSpinner();
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 5000 });
            return false;
          } else {
            this.app.hideSpinner();
            this.app.pin = "";
            this.toastr.successToastr(data.msg, "Success!", {
              toastTimeout: 2500,
            });
            this.getSection();
            return false;
          }
        });
    } else {
      this.app.genPin();
    }
  }

  //******************** Department change status
  change(e, i) {
    if (this.app.pin == "") {
      if (i.delFlag == false) {
        e.source.checked = false;
      } else if (i.delFlag == true) {
        e.source.checked = true;
      }
    }
  }

  //******************** function for saving and updating the data
  save() {
    if (this.ddlCompany == "" || this.ddlCompany == "0") {
      this.toastr.errorToastr("Please Select Company", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.sectionName == "") {
      this.toastr.errorToastr("Please Enter Section Name", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.departmentId == 0) {
      this.toastr.errorToastr("Please Select Department", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.extractSelectedBranchsList() == false) {
      this.toastr.errorToastr("Please Select Branch", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      if (this.sectionId == "") {
        var saveData = {
          sectionCd: 0,
          deptCd: this.departmentId,
          companyId: this.ddlCompany,
          sectionName: this.sectionName,
          branch: JSON.stringify(this.selectedBranchList),
          DelFlag: false,
          connectedUser: 12000,
        };

        //var token = localStorage.getItem(this.tokenKey);
        // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

        this.http
          .post(this.serverUrl + "api/saveSection", saveData, {
            headers: reqHeader,
          })
          .subscribe((data: any) => {
            // this.http.post(this.serverUrl + 'api/saveDepartment', saveData).subscribe((data: any) => {

            //alert(data.msg);
            if (data.msg == "Record Saved Successfully!") {
              this.toastr.successToastr(data.msg, "Success!", {
                toastTimeout: 2500,
              });
              this.clear();
              this.getSectionDetails();
              this.getSection();
              return false;
            } else {
              this.toastr.errorToastr(data.msg, "Error !", {
                toastTimeout: 5000,
              });
              return false;
            }
          });
      } else {
        var updateData = {
          sectionCd: this.sectionId,
          deptCd: this.departmentId,
          companyId: this.ddlCompany,
          sectionName: this.sectionName,
          branch: JSON.stringify(this.selectedBranchList),
          DelFlag: false,
          connectedUser: 12000,
        };

        //var token = localStorage.getItem(this.tokenKey);
        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

        this.http
          .put(this.serverUrl + "api/updateSection", updateData, {
            headers: reqHeader,
          })
          .subscribe((data: any) => {
            if (data.msg == undefined) {
              this.toastr.errorToastr(data.msg, "Error!", {
                toastTimeout: 5000,
              });
              return false;
            } else {
              this.toastr.successToastr(data.msg, "Success!", {
                toastTimeout: 2500,
              });
              this.clear();
              this.getSectionDetails();
              this.getSection();

              return false;
            }
          });
      }
    }
  }

  //******************** clear the input fields
  clear() {
    this.sectHeading = "Add";
    this.sectionId = "";
    this.departmentId = 0;
    this.ddlCompany = "0";
    this.sectionName = "";

    this.resetList(0);
  }

  //******************** reset branchs list
  resetList(department) {
    for (var i = 0; i < this.branchList.length; i++) {
      this.branchList[i].status = 0;
    }

    this.locationList = [];
    var tempList = this.branchList.filter((x) => x.deptCd == department);

    for (var i = 0; i < tempList.length; i++) {
      this.locationList.push(tempList[i]);
    }
  }

  //******************** change branch status (checked or not)
  selectBranch(item) {
    if (item.status == 0) {
      item.status = 1;
    } else {
      item.status = 0;
    }
  }

  //******************** extracting selected branches
  extractSelectedBranchsList() {
    this.selectedBranchList = [];
    var tempList = this.locationList.filter((x) => x.status == 1);

    if (tempList.length == 0) {
      return false;
    } else {
      for (var i = 0; i < this.locationList.length; i++) {
        if (this.locationList[i].status == 1) {
          this.selectedBranchList.push({
            branchID: this.locationList[i].locationCd,
          });
        }
      }
      return true;
    }
  }

  //******************** edit function
  edit(item) {
    this.clear();

    if (item.delFlag == 0) {
      this.sectHeading = "Edit";
      this.sectionId = item.sectCd;
      this.ddlCompany = item.cmpnyID;
      this.sectionName = item.sectName;
      this.departmentId = item.deptCd;

      this.locationList = [];
      var tempList = this.branchList.filter((x) => x.deptCd == item.deptCd);

      for (var i = 0; i < tempList.length; i++) {
        this.locationList.push(tempList[i]);
      }

      this.editSelectedBranchsList(item.sectCd, item.deptCd);
    }
  }

  //******************** extracting selected branches
  editSelectedBranchsList(section, department) {
    var tempList = this.departmentDetailsList.filter(
      (x) => x.sectCd == section && x.deptCd == department
    );

    for (var i = 0; i < tempList.length; i++) {
      for (var j = 0; j < this.locationList.length; j++) {
        if (this.locationList[j].locationCd == tempList[i].locationCd) {
          this.locationList[j].status = 1;
        }
      }
    }
  }

  //function for sorting table data
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  // For Print Purpose
  printDiv() {
    // var commonCss = ".commonCss{font-family: Arial, Helvetica, sans-serif; text-align: center; }";

    // var cssHeading = ".cssHeading {font-size: 25px; font-weight: bold;}";
    // var cssAddress = ".cssAddress {font-size: 16px; }";
    // var cssContact = ".cssContact {font-size: 16px; }";

    // var tableCss = "table {width: 100%; border-collapse: collapse;}    table thead tr th {text-align: left; font-family: Arial, Helvetica, sans-serif; font-weight: bole; border-bottom: 1px solid black; margin-left: -3px;}     table tbody tr td {font-family: Arial, Helvetica, sans-serif; border-bottom: 1px solid #ccc; margin-left: -3px; height: 33px;}";

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
}
