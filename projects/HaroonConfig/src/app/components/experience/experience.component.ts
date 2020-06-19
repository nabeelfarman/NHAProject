import { Component, OnInit, ViewChild } from "@angular/core";
import { ToastrManager } from "ng6-toastr-notifications";

import { AppComponent } from "src/app/app.component";
// import {
//   IgxExcelExporterOptions,
//   IgxExcelExporterService,
//   IgxGridComponent,
//   IgxCsvExporterService,
//   IgxCsvExporterOptions,
//   CsvFileTypes
// } from "igniteui-angular";
import { HttpHeaders, HttpClient } from "@angular/common/http";

declare var $: any;

//----------------------------------------------------------------------------//
//-------------------Working of this typescript file are as follows-----------//
//-------------------Getting experience type data --------------------------------//
//-------------------Getting experience group data -------------------------------//
//-------------------Getting experience Criteria data ----------------------------//
//-------------------Adding experience Criteria data into database ---------------//
//-------------------Update experience Criteria data into database ---------------//
//-------------------Delete experience Criteria data from database ---------------//
//-------------------For sorting the record-----------------------------------//
//-------------------Export into PDF, CSV, Excel -----------------------------//
//----------------------------------------------------------------------------//

@Component({
  selector: "app-experience",
  templateUrl: "./experience.component.html",
  styleUrls: ["./experience.component.scss"],
})
export class ExperienceComponent implements OnInit {
  serverUrl = "http://ambit-erp.southeastasia.cloudapp.azure.com:9046/";

  postSearch = "";

  tokenKey = "token";

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  expHeading = "Add";
  //Lists
  degreeTypeList = [];
  degreeGroupList = [];
  degreeCriteriaList = [];
  // list for excel data
  excelDataList = [];

  //Main page ng-models
  tblSearch = "";
  //degreeCriteriaId = '';
  //Ng-Models Add Degree Modal

  degreeId = "";
  //degreeGroupId = '';
  degreeTypeName = "";

  degreeGroup = "";
  //degreeGroupDescription = '';
  degreeTitleId = "";
  degreeTitle = "";
  degreeTitleDescription = "";

  //Ng-Models for delete modal
  userPassword = "";
  userPINCode = "";
  dCriteriaId = "";

  //* variables for pagination and orderby pipe
  p = 1;
  pDept = 1;
  order = "info.name";
  reverse = false;
  sortedCollection: any[];
  itemPerPage = "10";
  itemPerPageDept = "5";

  constructor(
    public toastr: ToastrManager,
    private app: AppComponent,
    // private excelExportService: IgxExcelExporterService,
    // private csvExportService: IgxCsvExporterService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.getExperienceType();
    this.getExperienceGroup();
    this.getExperienceCriteria();

    //this.assignValue();
  }

  // @ViewChild("excelDataContent") public excelDataContent: IgxGridComponent; //For excel

  // get degree type
  getExperienceType() {
    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "api/getExperienceType", { headers: reqHeader })
      .subscribe((data: any) => {
        this.degreeTypeList = data;

        this.degreeId = this.degreeTypeList[3].qlfctnTypeCd;
        this.degreeTypeName = this.degreeTypeList[3].qlfctnTypeName;
      });
  }

  // get degree group
  getExperienceGroup() {
    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "api/getExperienceGroup", { headers: reqHeader })
      .subscribe((data: any) => {
        this.degreeGroupList = data;
      });
  }

  // get the degree criteria
  getExperienceCriteria() {
    var Token = localStorage.getItem(this.tokenKey);

    this.app.showSpinner();
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "api/getExperienceCriteria", { headers: reqHeader })
      .subscribe((data: any) => {
        this.degreeCriteriaList = data;
        this.app.hideSpinner();
      });
  }

  // save degree criteria
  saveExperienceCriteria() {
    //this.degreeId = this.degreeTypeList[0].qlfctnTypeCd;

    //alert(this.degreeTitleId);

    if (this.degreeGroup == "") {
      this.toastr.errorToastr("Please Select Degree Group", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.degreeTitle == "") {
      this.toastr.errorToastr("Please Enter Degree Title", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.degreeTitleDescription == "") {
      this.toastr.errorToastr(
        "Please Enter Degree Title Description",
        "Error",
        { toastTimeout: 2500 }
      );
      return false;
    } else {
      if (this.degreeTitleId != "") {
        //return false;
        var updateData = {
          qlfctnCriteriaCd: this.degreeTitleId,
          qlfctnTypeCd: this.degreeId,
          qlfctnCd: this.degreeGroup,
          qlfctnCriteriaName: this.degreeTitle,
          qlfctnCriteriaDesc: this.degreeTitleDescription,
          connectedUser: 12000,
        };

        var token = localStorage.getItem(this.tokenKey);

        this.app.showSpinner();
        var reqHeader = new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        });

        this.http
          .put(this.serverUrl + "api/updateExperienceCriteria", updateData, {
            headers: reqHeader,
          })
          .subscribe((data: any) => {
            if (data.msg == "Record Updated Successfully!") {
              this.toastr.successToastr(data.msg, "Success!", {
                toastTimeout: 2500,
              });
              this.clear();
              $("#addDegreeModal").modal("hide");
              this.getExperienceCriteria();
              this.app.hideSpinner();
              return false;
            } else if (data.msg == "Update - Record Already Exists!") {
              this.toastr.errorToastr(data.msg, "Error!", {
                toastTimeout: 2500,
              });
              this.clear();
              $("#addDegreeModal").modal("hide");
              this.getExperienceCriteria();
              this.app.hideSpinner();
              return false;
            } else {
              this.toastr.errorToastr(data.msg, "Error!", {
                toastTimeout: 2500,
              });
              this.clear();
              $("#addDegreeModal").modal("hide");
              this.getExperienceCriteria();
              this.app.hideSpinner();
              return false;
            }
          });
      } else {
        var saveData = {
          qlfctnTypeCd: this.degreeId,
          qlfctnCd: this.degreeGroup,
          qlfctnCriteriaName: this.degreeTitle,
          qlfctnCriteriaDesc: this.degreeTitleDescription,
          connectedUser: 12000,
        };

        this.app.showSpinner();
        var token = localStorage.getItem(this.tokenKey);

        // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });
        //alert(reqHeader);
        this.http
          .post(this.serverUrl + "api/saveExperienceCriteria", saveData, {
            responseType: "json",
          })
          .subscribe((data: any) => {
            // this.http.post(this.serverUrl + 'api/saveDepartment', saveData).subscribe((data: any) => {

            if (data.msg == "Record Saved Successfully!") {
              this.toastr.successToastr(data.msg, "Success!", {
                toastTimeout: 2500,
              });
              this.clear();
              $("#addDegreeModal").modal("hide");
              this.getExperienceCriteria();
              this.app.hideSpinner();
              return false;
            } else if (data.msg == "Insert - Record Already Exists!") {
              this.toastr.errorToastr(data.msg, "Error!", {
                toastTimeout: 2500,
              });
              this.clear();
              $("#addDegreeModal").modal("hide");
              this.getExperienceCriteria();
              this.app.hideSpinner();
              return false;
            } else {
              this.toastr.errorToastr(data.msg, "Error !", {
                toastTimeout: 2500,
              });
              this.clear();
              $("#addDegreeModal").modal("hide");
              this.getExperienceCriteria();
              this.app.hideSpinner();
              return false;
            }
          });
      }
    }
  }

  // edit degree criteria
  edit(item) {
    this.expHeading = "Edit";
    this.degreeId = item.qlfctnTypeCd;
    this.degreeGroup = item.qlfctnCd;
    this.degreeTitleId = item.qlfctnCriteriaCd;
    this.degreeTitle = item.qlfctnCriteriaName;
    this.degreeTitleDescription = item.qlfctnCriteriaDesc;

    //alert(this.degreeGroup + "  titleId =" + this.degreeTitleId);
  }

  // clear the fields
  clear() {
    //alert("Data Clear");
    //degreeId = '';
    //degreeType = '';
    //degreeTypeName = '';
    this.degreeGroup = "";
    //this.degreeGroupDescription = '';
    this.degreeTitleId = "";
    this.degreeTitle = "";
    this.degreeTitleDescription = "";

    this.expHeading = "Add";

    this.dCriteriaId = "";
    this.userPassword = "";
    this.userPINCode = "";
  }

  // get the "ids" of the delete entry
  deleteExperienceCriteria(item) {
    this.clear();
    this.dCriteriaId = item.qlfctnCriteriaCd;
    this.degreeId = item.qlfctnTypeCd;
    this.degreeGroup = item.qlfctnCd;
    this.degreeTitle = item.qlfctnCriteriaName;
    this.degreeTitleDescription = item.qlfctnCriteriaDesc;

    this.generatePin();
  }

  /*** Pin generation or Delete Role  ***/
  generatePin() {
    //* check if global variable is empty
    if (this.app.pin != "") {
      //* Initialize List and Assign data to list. Sending list to api

      this.app.showSpinner();

      var data = {
        qlfctnCriteriaCd: this.dCriteriaId,
        qlfctnTypeCd: this.degreeId,
        qlfctnCd: this.degreeGroup,
        qlfctnCriteriaName: this.degreeTitle,
        qlfctnCriteriaDesc: this.degreeTitleDescription,
        connectedUser: this.app.empId,
      };

      var token = localStorage.getItem(this.tokenKey);

      var reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      });

      this.http
        .put(this.serverUrl + "api/deleteExperienceCriteria", data, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "Record Deleted Successfully!") {
            this.toastr.successToastr(data.msg, "Success!", {
              toastTimeout: 2500,
            });
            this.clear();
            this.getExperienceCriteria();
            this.app.hideSpinner();
            return false;
          } else {
            this.toastr.errorToastr(data.msg, "Error!", {
              toastTimeout: 2500,
            });
            return false;
          }
        });
    } else {
      this.app.genPin();
    }
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  // Print Function
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

  // PDF Function
  downloadPDF() {
    alert("Hi, I am PDF function.");
  }

  // CSV Function
  // public downloadCSV() {
  //   this.app.download_CSV(this.degreeCriteriaList);
  //   return false;
  //   // case 1: When tblSearch is empty then assign full data list
  //   if (this.tblSearch == "") {
  //     var completeDataList = [];
  //     for (var i = 0; i < this.degreeCriteriaList.length; i++) {
  //       //alert(this.tblSearch + " - " + this.degreeCriteriaList[i].departmentName)
  //       completeDataList.push({
  //         Degree_Group: this.degreeCriteriaList[i].qlfctnName,
  //         Degree_Title: this.degreeCriteriaList[i].qlfctnCriteriaName,
  //         Degree_Title_Description: this.degreeCriteriaList[i]
  //           .qlfctnCriteriaDesc
  //       });
  //     }
  //     this.csvExportService.exportData(
  //       completeDataList,
  //       new IgxCsvExporterOptions("DegreeCompleteCSV", CsvFileTypes.CSV)
  //     );
  //   }
  //   // case 2: When tblSearch is not empty then assign new data list
  //   else if (this.tblSearch != "") {
  //     var filteredDataList = [];
  //     for (var i = 0; i < this.degreeCriteriaList.length; i++) {
  //       if (
  //         this.degreeCriteriaList[i].qlfctnName
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase()) ||
  //         this.degreeCriteriaList[i].qlfctnCriteriaName
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase()) ||
  //         this.degreeCriteriaList[i].qlfctnCriteriaDesc
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase())
  //       ) {
  //         filteredDataList.push({
  //           Degree_Group: this.degreeCriteriaList[i].qlfctnName,
  //           Degree_Title: this.degreeCriteriaList[i].qlfctnCriteriaName,
  //           Degree_Title_Description: this.degreeCriteriaList[i]
  //             .qlfctnCriteriaDesc
  //         });
  //       }
  //     }

  //     if (filteredDataList.length > 0) {
  //       this.csvExportService.exportData(
  //         filteredDataList,
  //         new IgxCsvExporterOptions("DegreeFilterCSV", CsvFileTypes.CSV)
  //       );
  //     } else {
  //       this.toastr.errorToastr("Oops! No data found", "Error", {
  //         toastTimeout: 2500
  //       });
  //     }
  //   }
  // }

  // Excel Xlxs Function
  // public downloadExcel() {
  //   this.app.download_Excel(this.degreeCriteriaList);
  //   return false;
  //   // case 1: When tblSearch is empty then assign full data list
  //   if (this.tblSearch == "") {
  //     //var completeDataList = [];
  //     for (var i = 0; i < this.degreeCriteriaList.length; i++) {
  //       this.excelDataList.push({
  //         Degree_Group: this.degreeCriteriaList[i].qlfctnName,
  //         Degree_Title: this.degreeCriteriaList[i].qlfctnCriteriaName,
  //         Degree_Title_Description: this.degreeCriteriaList[i]
  //           .qlfctnCriteriaDesc
  //       });
  //     }
  //     this.excelExportService.export(
  //       this.excelDataContent,
  //       new IgxExcelExporterOptions("DegreeCompleteExcel")
  //     );
  //     this.excelDataList = [];
  //   }
  //   // case 2: When tblSearch is not empty then assign new data list
  //   else if (this.tblSearch != "") {
  //     for (var i = 0; i < this.degreeCriteriaList.length; i++) {
  //       if (
  //         this.degreeCriteriaList[i].qlfctnName
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase()) ||
  //         this.degreeCriteriaList[i].qlfctnCriteriaName
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase()) ||
  //         this.degreeCriteriaList[i].qlfctnCriteriaDesc
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase())
  //       ) {
  //         this.excelDataList.push({
  //           Degree_Group: this.degreeCriteriaList[i].qlfctnName,
  //           Degree_Title: this.degreeCriteriaList[i].qlfctnCriteriaName,
  //           Degree_Title_Description: this.degreeCriteriaList[i]
  //             .qlfctnCriteriaDesc
  //         });
  //       }
  //     }

  //     if (this.excelDataList.length > 0) {
  //       //alert("Filter List " + this.excelDataList.length);

  //       this.excelExportService.export(
  //         this.excelDataContent,
  //         new IgxExcelExporterOptions("DegreeFilterExcel")
  //       );
  //       this.excelDataList = [];
  //     } else {
  //       this.toastr.errorToastr("Oops! No data found", "Error", {
  //         toastTimeout: 2500
  //       });
  //     }
  //   }
  // }
}
