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
//-------------------Getting certificate type data --------------------------------//
//-------------------Getting certificate group data -------------------------------//
//-------------------Getting certificate Criteria data ----------------------------//
//-------------------Adding certificate Criteria data into database ---------------//
//-------------------Update certificate Criteria data into database ---------------//
//-------------------Delete certificate Criteria data from database ---------------//
//-------------------For sorting the record-----------------------------------//
//-------------------Export into PDF, CSV, Excel -----------------------------//
//----------------------------------------------------------------------------//

@Component({
  selector: "app-certificate",
  templateUrl: "./certificate.component.html",
  styleUrls: ["./certificate.component.scss"],
})
export class CertificateComponent implements OnInit {
  //serverUrl = "http://localhost:9016/";
  // serverUrl = "http://52.163.189.189:9016/";
  serverUrl = "http://ambit-erp.southeastasia.cloudapp.azure.com:9016/";

  tokenKey = "token";

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  //Lists
  certificateTypeList = [];
  certificateGroupList = [];
  certificateCriteriaList = [];
  // list for excel data
  excelDataList = [];

  //Main page ng-models
  tblSearch = "";
  tblSearchGroup = "";

  //Ng-Models Add certificate Modal
  certificateId = "";
  certificateTypeName = "";
  certificateGroup = "";
  certificateGroupDescription = "";
  certificateTitleId = "";
  certificateTitle = "";
  certificateTitleDescription = "";

  //Ng-models for add certificate group modal
  certfctGroupId = "";
  certfctGroupName = "";
  certfctGroupDesc = "";

  //Ng-Models for delete modal
  userPassword = "";
  userPINCode = "";
  dCriteriaId = "";
  dGroupId = "";

  //* variables for pagination and orderby pipe
  p = 1;
  pGroup = 1;
  order = "info.name";
  reverse = false;
  // orderGroup = 'info.name';
  // reverseGroup = false;
  sortedCollection: any[];
  itemPerPage = "10";
  itemPerPageGroup = "5";

  constructor(
    public toastr: ToastrManager,
    private app: AppComponent,
    // private excelExportService: IgxExcelExporterService,
    // private csvExportService: IgxCsvExporterService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.getCertificateType();
    this.getCertificateGroup();
    this.getCertificateCriteria();

    //this.assignValue();
  }

  // @ViewChild("excelDataContent") public excelDataContent: IgxGridComponent; //For excel

  // get Certificate type
  getCertificateType() {
    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "api/getCertificateType", { headers: reqHeader })
      .subscribe((data: any) => {
        this.certificateTypeList = data;

        this.certificateId = this.certificateTypeList[2].qlfctnTypeCd;
        this.certificateTypeName = this.certificateTypeList[2].qlfctnTypeName;
      });
  }

  // get Certificate group
  getCertificateGroup() {
    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "api/getCertificateGroup", { headers: reqHeader })
      .subscribe((data: any) => {
        this.certificateGroupList = data;
      });
  }

  // get the Certificate criteria
  getCertificateCriteria() {
    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "api/getCertificateCriteria", {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.certificateCriteriaList = data;
      });
  }

  // save Certificate criteria
  saveCertificateCriteria() {
    if (this.certificateGroup == "") {
      this.toastr.errorToastr("Please Select certificate Group", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.certificateTitle == "") {
      this.toastr.errorToastr("Please Enter certificate Title", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.certificateTitleDescription == "") {
      this.toastr.errorToastr(
        "Please Enter certificate Title Description",
        "Error",
        { toastTimeout: 2500 }
      );
      return false;
    } else {
      if (this.certificateTitleId != "") {
        //return false;
        var updateData = {
          qlfctnCriteriaCd: this.certificateTitleId,
          qlfctnTypeCd: this.certificateId,
          qlfctnCd: this.certificateGroup,
          qlfctnCriteriaName: this.certificateTitle,
          qlfctnCriteriaDesc: this.certificateTitleDescription,
          connectedUser: 12000,
        };

        var token = localStorage.getItem(this.tokenKey);

        var reqHeader = new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        });

        this.http
          .put(this.serverUrl + "api/updateCertificateCriteria", updateData, {
            headers: reqHeader,
          })
          .subscribe((data: any) => {
            //alert(data.msg);

            if (data.msg == "Record Updated Successfully!") {
              this.toastr.successToastr(data.msg, "Success!", {
                toastTimeout: 2500,
              });

              this.clear();
              $("#addCertificateModal").modal("hide");
              this.getCertificateCriteria();
              //this.getCertificateCriteria();

              return false;
            } else if (data.msg == "Update - Record Already Exists!") {
              this.toastr.errorToastr(data.msg, "Error!", {
                toastTimeout: 2500,
              });
              this.clear();
              $("#addCertificateModal").modal("hide");
              this.getCertificateCriteria();
              //this.getCertificateCriteria();
              return false;
            } else {
              this.toastr.errorToastr(data.msg, "Error!", {
                toastTimeout: 2500,
              });
              this.clear();
              $("#addCertificateModal").modal("hide");
              this.getCertificateCriteria();
              //this.getCertificateCriteria();
              return false;
            }
          });
      } else {
        var saveData = {
          qlfctnTypeCd: this.certificateId,
          qlfctnCd: this.certificateGroup,
          qlfctnCriteriaName: this.certificateTitle,
          qlfctnCriteriaDesc: this.certificateTitleDescription,
          connectedUser: 12000,
        };

        var token = localStorage.getItem(this.tokenKey);

        // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });
        //alert(reqHeader);
        this.http
          .post(this.serverUrl + "api/saveCertificateCriteria", saveData, {
            responseType: "json",
          })
          .subscribe((data: any) => {
            // this.http.post(this.serverUrl + 'api/saveDepartment', saveData).subscribe((data: any) => {

            //alert(data.msg);
            //return false;

            if (data.msg == "Record Saved Successfully!") {
              this.toastr.successToastr(data.msg, "Success!", {
                toastTimeout: 2500,
              });
              this.clear();
              $("#addCertificateModal").modal("hide");
              this.getCertificateCriteria();
              //this.getCertificateCriteria();

              return false;
            } else if (data.msg == "Insert - Record Already Exists!") {
              this.toastr.errorToastr(data.msg, "Error!", {
                toastTimeout: 2500,
              });
              this.clear();
              $("#addCertificateModal").modal("hide");
              this.getCertificateCriteria();
              //this.getCertificateCriteria();

              return false;
            } else {
              this.toastr.errorToastr(data.msg, "Error !", {
                toastTimeout: 2500,
              });
              this.clear();
              $("#addCertificateModal").modal("hide");
              this.getCertificateCriteria();
              //this.getCertificateCriteria();

              return false;
            }
          });
      }
    }
  }

  //save certificate group
  saveCertificateGroup() {
    if (this.certfctGroupName == "") {
      this.toastr.errorToastr("Please Select certificate Group", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.certfctGroupDesc == "") {
      this.toastr.errorToastr("Please Enter Description", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      if (this.certfctGroupId != "") {
        //return false;
        var updateData = {
          qlfctnCd: this.certfctGroupId,
          qlfctnName: this.certfctGroupName,
          qlfctnDesc: this.certfctGroupDesc,
          qlfctnTypeCd: this.certificateId,
          connectedUser: 12000,
        };

        var token = localStorage.getItem(this.tokenKey);

        var reqHeader = new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        });

        this.http
          .put(this.serverUrl + "api/updateCertificateGroup", updateData, {
            headers: reqHeader,
          })
          .subscribe((data: any) => {
            //alert(data.msg);

            if (data.msg == "Record Updated Successfully!") {
              this.toastr.successToastr(data.msg, "Success!", {
                toastTimeout: 2500,
              });

              this.clear();
              //$('#addCertificateGroupModal').modal('hide');
              this.getCertificateGroup();
              //this.getCertificateCriteria();

              return false;
            } else if (data.msg == "Update - Record Already Exists!") {
              this.toastr.errorToastr(data.msg, "Error!", {
                toastTimeout: 2500,
              });
              this.clear();
              //$('#addCertificateGroupModal').modal('hide');
              this.getCertificateGroup();
              //this.getCertificateCriteria();
              return false;
            } else {
              this.toastr.errorToastr(data.msg, "Error!", {
                toastTimeout: 2500,
              });
              this.clear();
              //$('#addCertificateGroupModal').modal('hide');
              this.getCertificateGroup();
              //this.getCertificateCriteria();
              return false;
            }
          });
      } else {
        var saveData = {
          qlfctnName: this.certfctGroupName,
          qlfctnDesc: this.certfctGroupDesc,
          qlfctnTypeCd: this.certificateId,
          connectedUser: 12000,
        };

        var token = localStorage.getItem(this.tokenKey);

        // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });
        //alert(reqHeader);
        this.http
          .post(this.serverUrl + "api/saveCertificateGroup", saveData, {
            responseType: "json",
          })
          .subscribe((data: any) => {
            // this.http.post(this.serverUrl + 'api/saveDepartment', saveData).subscribe((data: any) => {

            //alert(data.msg);
            //return false;

            if (data.msg == "Record Saved Successfully!") {
              this.toastr.successToastr(data.msg, "Success!", {
                toastTimeout: 2500,
              });
              this.clear();
              //$('#addCertificateGroupModal').modal('hide');
              this.getCertificateGroup();
              //this.getCertificateCriteria();

              return false;
            } else if (data.msg == "Insert - Record Already Exists!") {
              this.toastr.errorToastr(data.msg, "Error!", {
                toastTimeout: 2500,
              });
              this.clear();
              //$('#addCertificateGroupModal').modal('hide');
              this.getCertificateGroup();
              //this.getCertificateCriteria();

              return false;
            } else {
              this.toastr.errorToastr(data.msg, "Error !", {
                toastTimeout: 2500,
              });
              this.clear();
              //$('#addCertificateGroupModal').modal('hide');
              this.getCertificateGroup();
              //this.getCertificateCriteria();

              return false;
            }
          });
      }
    }
  }

  // edit certificate criteria
  edit(item) {
    this.certificateId = item.qlfctnTypeCd;
    this.certificateGroup = item.qlfctnCd;
    this.certificateTitleId = item.qlfctnCriteriaCd;
    this.certificateTitle = item.qlfctnCriteriaName;
    this.certificateTitleDescription = item.qlfctnCriteriaDesc;

    //alert(this.certificateTitleId);
  }

  editGroup(item) {
    this.certfctGroupId = item.qlfctnCd;
    this.certfctGroupName = item.qlfctnName;
    this.certfctGroupDesc = item.qlfctnDesc;
    this.certificateId = item.qlfctnTypeCd;
  }

  // clear the fields
  clear() {
    //this.certificateId = '';
    //certificateType = '';
    //certificateTypeName = '';
    this.certificateGroup = "";
    //this.certificateGroupDescription = '';
    this.certificateTitleId = "";
    this.certificateTitle = "";
    this.certificateTitleDescription = "";

    this.certfctGroupId = "";
    this.certfctGroupName = "";
    this.certfctGroupDesc = "";

    this.dCriteriaId = "";
    this.userPassword = "";
    this.userPINCode = "";
    this.dGroupId = "";
  }

  deleteCertificateGroup(item) {
    this.clear();
    this.dGroupId = item.qlfctnCd;
    //this.certfctGroupName = item.qlfctnName;
    //this.certfctGroupDesc = item.qlfctnDesc;
    this.certificateId = item.qlfctnTypeCd;
    //alert("Type Id = " + this.certificateId);
  }

  // get the "ids" of the delete entry
  deleteCertificateCriteria(item) {
    this.clear();
    this.dCriteriaId = item.qlfctnCriteriaCd;
    // this.certificateId = item.qlfctnTypeCd;
    // this.certificateGroup = item.qlfctnCd;
    // this.certificateTitle = item.qlfctnCriteriaName;
    // this.certificateTitleDescription = item.qlfctnCriteriaDesc;
  }

  // delete the certificate criteria
  delete() {
    if (this.userPassword == "") {
      this.toastr.errorToastr("Please Enter Password", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.userPINCode == "") {
      this.toastr.errorToastr("Please Enter PIN Code", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      if (this.dCriteriaId != "") {
        var data = {
          qlfctnCriteriaCd: this.dCriteriaId,
          // "qlfctnTypeCd": this.certificateId,
          // "qlfctnCd": this.certificateGroup,
          // "qlfctnCriteriaName": this.certificateTitle,
          // "qlfctnCriteriaDesc": this.certificateTitleDescription,
          connectedUser: 12000,
        };

        var token = localStorage.getItem(this.tokenKey);

        var reqHeader = new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        });

        this.http
          .put(this.serverUrl + "api/deleteCertificateCriteria", data, {
            headers: reqHeader,
          })
          .subscribe((data: any) => {
            //alert(data.msg);

            if (data.msg == "Record Deleted Successfully!") {
              this.toastr.successToastr(data.msg, "Success!", {
                toastTimeout: 2500,
              });
              this.clear();
              $("#deleteModal").modal("hide");
              this.getCertificateCriteria();
              return false;
            } else {
              this.toastr.errorToastr(data.msg, "Error!", {
                toastTimeout: 2500,
              });
              return false;
            }
          });
      } else if (this.dGroupId != "") {
        var groupdata = {
          qlfctnCd: this.dGroupId,
          // "qlfctnTypeCd": this.certificateId,
          // "qlfctnName": this.certfctGroupName,
          // "qlfctnDesc": this.certfctGroupDesc,
          connectedUser: 12000,
        };

        var token = localStorage.getItem(this.tokenKey);

        var reqHeader = new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        });

        this.http
          .put(this.serverUrl + "api/deleteCertificateGroup", groupdata, {
            headers: reqHeader,
          })
          .subscribe((data: any) => {
            //alert(data.msg);

            if (data.msg == "Record Deleted Successfully!") {
              this.toastr.successToastr(data.msg, "Success!", {
                toastTimeout: 2500,
              });
              this.clear();
              $("#deleteModal").modal("hide");
              this.getCertificateGroup();
              return false;
            } else {
              this.toastr.errorToastr(data.msg, "Error!", {
                toastTimeout: 2500,
              });
              return false;
            }
          });
      } // else if ends
    } //else ends
  }

  //function for sorting/orderBy table data
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
  //   // case 1: When tblSearch is empty then assign full data list
  //   if (this.tblSearch == "") {
  //     var completeDataList = [];
  //     for (var i = 0; i < this.certificateCriteriaList.length; i++) {
  //       //alert(this.tblSearch + " - " + this.certificateCriteriaList[i].departmentName)
  //       completeDataList.push({
  //         certificate_Group: this.certificateCriteriaList[i].qlfctnName,
  //         certificate_Title: this.certificateCriteriaList[i].qlfctnCriteriaName,
  //         certificate_Title_Description: this.certificateCriteriaList[i]
  //           .qlfctnCriteriaDesc
  //       });
  //     }
  //     this.csvExportService.exportData(
  //       completeDataList,
  //       new IgxCsvExporterOptions("CertificateCompleteCSV", CsvFileTypes.CSV)
  //     );
  //   }
  //   // case 2: When tblSearch is not empty then assign new data list
  //   else if (this.tblSearch != "") {
  //     var filteredDataList = [];
  //     for (var i = 0; i < this.certificateCriteriaList.length; i++) {
  //       if (
  //         this.certificateCriteriaList[i].qlfctnName
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase()) ||
  //         this.certificateCriteriaList[i].qlfctnCriteriaName
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase()) ||
  //         this.certificateCriteriaList[i].qlfctnCriteriaDesc
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase())
  //       ) {
  //         filteredDataList.push({
  //           certificate_Group: this.certificateCriteriaList[i].qlfctnName,
  //           certificate_Title: this.certificateCriteriaList[i]
  //             .qlfctnCriteriaName,
  //           certificate_Title_Description: this.certificateCriteriaList[i]
  //             .qlfctnCriteriaDesc
  //         });
  //       }
  //     }

  //     if (filteredDataList.length > 0) {
  //       this.csvExportService.exportData(
  //         filteredDataList,
  //         new IgxCsvExporterOptions("CertificateFilterCSV", CsvFileTypes.CSV)
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
  //   // case 1: When tblSearch is empty then assign full data list
  //   if (this.tblSearch == "") {
  //     //var completeDataList = [];
  //     for (var i = 0; i < this.certificateCriteriaList.length; i++) {
  //       this.excelDataList.push({
  //         certificate_Group: this.certificateCriteriaList[i].qlfctnName,
  //         certificate_Title: this.certificateCriteriaList[i].qlfctnCriteriaName,
  //         certificate_Title_Description: this.certificateCriteriaList[i]
  //           .qlfctnCriteriaDesc
  //       });
  //     }
  //     this.excelExportService.export(
  //       this.excelDataContent,
  //       new IgxExcelExporterOptions("CertificateCompleteExcel")
  //     );
  //     this.excelDataList = [];
  //   }
  //   // case 2: When tblSearch is not empty then assign new data list
  //   else if (this.tblSearch != "") {
  //     for (var i = 0; i < this.certificateCriteriaList.length; i++) {
  //       if (
  //         this.certificateCriteriaList[i].qlfctnName
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase()) ||
  //         this.certificateCriteriaList[i].qlfctnCriteriaName
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase()) ||
  //         this.certificateCriteriaList[i].qlfctnCriteriaDesc
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase())
  //       ) {
  //         this.excelDataList.push({
  //           certificate_Group: this.certificateCriteriaList[i].qlfctnName,
  //           certificate_Title: this.certificateCriteriaList[i]
  //             .qlfctnCriteriaName,
  //           certificate_Title_Description: this.certificateCriteriaList[i]
  //             .qlfctnCriteriaDesc
  //         });
  //       }
  //     }

  //     if (this.excelDataList.length > 0) {
  //       //alert("Filter List " + this.excelDataList.length);

  //       this.excelExportService.export(
  //         this.excelDataContent,
  //         new IgxExcelExporterOptions("CertificateFilterExcel")
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
