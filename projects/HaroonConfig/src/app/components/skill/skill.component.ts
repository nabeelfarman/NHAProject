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
//-------------------Getting skill type data --------------------------------//
//-------------------Getting skill group data -------------------------------//
//-------------------Getting skill Criteria data ----------------------------//
//-------------------Adding skill Criteria data into database ---------------//
//-------------------Update skill Criteria data into database ---------------//
//-------------------Delete skill Criteria data from database ---------------//
//-------------------For sorting the record-----------------------------------//
//-------------------Export into PDF, CSV, Excel -----------------------------//
//---------------------------------------------------------------------------//
@Component({
  selector: "app-skill",
  templateUrl: "./skill.component.html",
  styleUrls: ["./skill.component.scss"],
})
export class SkillComponent implements OnInit {
  //serverUrl = "http://localhost:9018/";
  // serverUrl = "http://52.163.189.189:9018/";
  serverUrl = "http://ambit-erp.southeastasia.cloudapp.azure.com:9018/";

  tokenKey = "token";

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  //Lists
  skillTypeList = [];
  skillGroupList = [];
  skillCriteriaList = [];
  // list for excel data
  excelDataList = [];

  //Main page ng-models
  tblSearch = "";
  tblSearchGroup = "";

  //Ng-Models Add skill Modal
  skillId = "";
  skillTypeName = "";
  skillGroup = "";
  skillGroupDescription = "";
  skillTitleId = "";
  skillTitle = "";
  skillTitleDescription = "";

  //Ng-models for add skill group modal
  sklGroupId = "";
  sklGroupName = "";
  sklGroupDesc = "";

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
    this.getSkillType();
    this.getSkillGroup();
    this.getSkillCriteria();

    //this.assignValue();
  }

  // @ViewChild("excelDataContent") public excelDataContent: IgxGridComponent; //For excel

  // get skill type
  getSkillType() {
    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "api/getSkillType", { headers: reqHeader })
      .subscribe((data: any) => {
        this.skillTypeList = data;

        this.skillId = this.skillTypeList[4].qlfctnTypeCd;
        this.skillTypeName = this.skillTypeList[4].qlfctnTypeName;
      });
  }

  // get skill group
  getSkillGroup() {
    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "api/getSkillGroup", { headers: reqHeader })
      .subscribe((data: any) => {
        this.skillGroupList = data;
      });
  }

  // get the skill criteria
  getSkillCriteria() {
    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "api/getSkillCriteria", { headers: reqHeader })
      .subscribe((data: any) => {
        this.skillCriteriaList = data;
      });
  }

  // save skill criteria
  saveSkillCriteria() {
    if (this.skillGroup == "") {
      this.toastr.errorToastr("Please Select skill Group", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.skillTitle == "") {
      this.toastr.errorToastr("Please Enter skill Title", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.skillTitleDescription == "") {
      this.toastr.errorToastr("Please Enter skill Title Description", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      if (this.skillTitleId != "") {
        //return false;
        var updateData = {
          qlfctnCriteriaCd: this.skillTitleId,
          qlfctnTypeCd: this.skillId,
          qlfctnCd: this.skillGroup,
          qlfctnCriteriaName: this.skillTitle,
          qlfctnCriteriaDesc: this.skillTitleDescription,
          connectedUser: 12000,
        };

        var token = localStorage.getItem(this.tokenKey);

        var reqHeader = new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        });

        this.http
          .put(this.serverUrl + "api/updateSkillCriteria", updateData, {
            headers: reqHeader,
          })
          .subscribe((data: any) => {
            //alert(data.msg);

            if (data.msg == "Record Updated Successfully!") {
              this.toastr.successToastr(data.msg, "Success!", {
                toastTimeout: 2500,
              });
              this.clear();
              $("#addSkillModal").modal("hide");
              this.getSkillCriteria();
              return false;
            } else if (data.msg == "Update - Record Already Exists!") {
              this.toastr.errorToastr(data.msg, "Error!", {
                toastTimeout: 2500,
              });
              this.clear();
              $("#addSkillModal").modal("hide");
              this.getSkillCriteria();
              return false;
            } else {
              this.toastr.errorToastr(data.msg, "Error!", {
                toastTimeout: 2500,
              });
              this.clear();
              $("#addSkillModal").modal("hide");
              this.getSkillCriteria();
              return false;
            }
          });
      } else {
        var saveData = {
          qlfctnTypeCd: this.skillId,
          qlfctnCd: this.skillGroup,
          qlfctnCriteriaName: this.skillTitle,
          qlfctnCriteriaDesc: this.skillTitleDescription,
          connectedUser: 12000,
        };

        var token = localStorage.getItem(this.tokenKey);

        // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });
        //alert(reqHeader);
        this.http
          .post(this.serverUrl + "api/saveSkillCriteria", saveData, {
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
              $("#addSkillModal").modal("hide");
              this.getSkillCriteria();
              return false;
            } else if (data.msg == "Insert - Record Already Exists!") {
              this.toastr.errorToastr(data.msg, "Error!", {
                toastTimeout: 2500,
              });
              this.clear();
              $("#addSkillModal").modal("hide");
              this.getSkillCriteria();
              return false;
            } else {
              this.toastr.errorToastr(data.msg, "Error !", {
                toastTimeout: 2500,
              });
              this.clear();
              $("#addSkillModal").modal("hide");
              this.getSkillCriteria();
              return false;
            }
          });
      }
    }
  }

  //save skill group
  saveSkillGroup() {
    if (this.sklGroupName == "") {
      this.toastr.errorToastr("Please Select skill Group", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.sklGroupDesc == "") {
      this.toastr.errorToastr("Please Enter Description", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      if (this.sklGroupId != "") {
        //return false;
        var updateData = {
          qlfctnCd: this.sklGroupId,
          qlfctnName: this.sklGroupName,
          qlfctnDesc: this.sklGroupDesc,
          qlfctnTypeCd: this.skillId,
          connectedUser: 12000,
        };

        var token = localStorage.getItem(this.tokenKey);

        var reqHeader = new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        });

        this.http
          .put(this.serverUrl + "api/updateskillGroup", updateData, {
            headers: reqHeader,
          })
          .subscribe((data: any) => {
            //alert(data.msg);

            if (data.msg == "Record Updated Successfully!") {
              this.toastr.successToastr(data.msg, "Success!", {
                toastTimeout: 2500,
              });
              this.clear();
              $("#addSkillGroupModal").modal("hide");
              this.getSkillGroup();
              return false;
            } else if (data.msg == "Update - Record Already Exists!") {
              this.toastr.errorToastr(data.msg, "Error!", {
                toastTimeout: 2500,
              });
              this.clear();
              $("#addSkillGroupModal").modal("hide");
              this.getSkillGroup();
              return false;
            } else {
              this.toastr.errorToastr(data.msg, "Error!", {
                toastTimeout: 2500,
              });
              this.clear();
              $("#addSkillGroupModal").modal("hide");
              this.getSkillGroup();
              return false;
            }
          });
      } else {
        var saveData = {
          qlfctnName: this.sklGroupName,
          qlfctnDesc: this.sklGroupDesc,
          qlfctnTypeCd: this.skillId,
          connectedUser: 12000,
        };

        var token = localStorage.getItem(this.tokenKey);

        // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });
        //alert(reqHeader);
        this.http
          .post(this.serverUrl + "api/saveSkillGroup", saveData, {
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
              $("#addSkillGroupModal").modal("hide");
              this.getSkillGroup();
              return false;
            } else if (data.msg == "Insert - Record Already Exists!") {
              this.toastr.errorToastr(data.msg, "Error!", {
                toastTimeout: 2500,
              });
              this.clear();
              $("#addSkillGroupModal").modal("hide");
              this.getSkillGroup();
              return false;
            } else {
              this.toastr.errorToastr(data.msg, "Error !", {
                toastTimeout: 2500,
              });
              this.clear();
              $("#addSkillGroupModal").modal("hide");
              this.getSkillGroup();
              return false;
            }
          });
      }
    }
  }

  // edit skill criteria
  edit(item) {
    this.skillId = item.qlfctnTypeCd;
    this.skillGroup = item.qlfctnCd;
    this.skillTitleId = item.qlfctnCriteriaCd;
    this.skillTitle = item.qlfctnCriteriaName;
    this.skillTitleDescription = item.qlfctnCriteriaDesc;

    //alert(this.skillTitleId);
  }

  editGroup(item) {
    this.sklGroupId = item.qlfctnCd;
    this.sklGroupName = item.qlfctnName;
    this.sklGroupDesc = item.qlfctnDesc;
    this.skillId = item.qlfctnTypeCd;
  }

  // clear the fields
  clear() {
    //this.skillId = '';
    //skillType = '';
    //skillTypeName = '';
    this.skillGroup = "";
    //this.skillGroupDescription = '';
    this.skillTitleId = "";
    this.skillTitle = "";
    this.skillTitleDescription = "";

    this.sklGroupId = "";
    this.sklGroupName = "";
    this.sklGroupDesc = "";

    this.dCriteriaId = "";
    this.userPassword = "";
    this.userPINCode = "";
    this.dGroupId = "";
  }

  deleteSkillGroup(item) {
    this.clear();
    this.dGroupId = item.qlfctnCd;
    //this.sklGroupName = item.qlfctnName;
    //this.sklGroupDesc = item.qlfctnDesc;

    this.skillId = item.qlfctnTypeCd; // qualification Type Id

    //alert("Type Id = " + this.skillId);
  }

  // get the "ids" of the delete entry
  deleteSkillCriteria(item) {
    this.clear();
    this.dCriteriaId = item.qlfctnCriteriaCd;
    // this.skillId = item.qlfctnTypeCd;
    // this.skillGroup = item.qlfctnCd;
    // this.skillTitle = item.qlfctnCriteriaName;
    // this.skillTitleDescription = item.qlfctnCriteriaDesc;
  }

  // delete the skill criteria
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
          // "qlfctnTypeCd": this.skillId,
          // "qlfctnCd": this.skillGroup,
          // "qlfctnCriteriaName": this.skillTitle,
          // "qlfctnCriteriaDesc": this.skillTitleDescription,
          connectedUser: 12000,
        };

        var token = localStorage.getItem(this.tokenKey);

        var reqHeader = new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        });

        this.http
          .put(this.serverUrl + "api/deleteskillCriteria", data, {
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
              this.getSkillCriteria();
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
          qlfctnTypeCd: this.skillId,
          // "qlfctnName": this.sklGroupName,
          // "qlfctnDesc": this.sklGroupDesc,
          connectedUser: 12000,
        };

        var token = localStorage.getItem(this.tokenKey);

        var reqHeader = new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        });

        this.http
          .put(this.serverUrl + "api/deleteSkillGroup", groupdata, {
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
              this.getSkillGroup();
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
  //     for (var i = 0; i < this.skillCriteriaList.length; i++) {
  //       //alert(this.tblSearch + " - " + this.skillCriteriaList[i].departmentName)
  //       completeDataList.push({
  //         skill_Group: this.skillCriteriaList[i].qlfctnName,
  //         skill_Title: this.skillCriteriaList[i].qlfctnCriteriaName,
  //         skill_Title_Description: this.skillCriteriaList[i].qlfctnCriteriaDesc
  //       });
  //     }
  //     this.csvExportService.exportData(
  //       completeDataList,
  //       new IgxCsvExporterOptions("skillCompleteCSV", CsvFileTypes.CSV)
  //     );
  //   }
  //   // case 2: When tblSearch is not empty then assign new data list
  //   else if (this.tblSearch != "") {
  //     var filteredDataList = [];
  //     for (var i = 0; i < this.skillCriteriaList.length; i++) {
  //       if (
  //         this.skillCriteriaList[i].qlfctnName
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase()) ||
  //         this.skillCriteriaList[i].qlfctnCriteriaName
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase()) ||
  //         this.skillCriteriaList[i].qlfctnCriteriaDesc
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase())
  //       ) {
  //         filteredDataList.push({
  //           skill_Group: this.skillCriteriaList[i].qlfctnName,
  //           skill_Title: this.skillCriteriaList[i].qlfctnCriteriaName,
  //           skill_Title_Description: this.skillCriteriaList[i]
  //             .qlfctnCriteriaDesc
  //         });
  //       }
  //     }

  //     if (filteredDataList.length > 0) {
  //       this.csvExportService.exportData(
  //         filteredDataList,
  //         new IgxCsvExporterOptions("skillFilterCSV", CsvFileTypes.CSV)
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
  //     for (var i = 0; i < this.skillCriteriaList.length; i++) {
  //       this.excelDataList.push({
  //         skill_Group: this.skillCriteriaList[i].qlfctnName,
  //         skill_Title: this.skillCriteriaList[i].qlfctnCriteriaName,
  //         skill_Title_Description: this.skillCriteriaList[i].qlfctnCriteriaDesc
  //       });
  //     }
  //     this.excelExportService.export(
  //       this.excelDataContent,
  //       new IgxExcelExporterOptions("skillCompleteExcel")
  //     );
  //     this.excelDataList = [];
  //   }
  //   // case 2: When tblSearch is not empty then assign new data list
  //   else if (this.tblSearch != "") {
  //     for (var i = 0; i < this.skillCriteriaList.length; i++) {
  //       if (
  //         this.skillCriteriaList[i].qlfctnName
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase()) ||
  //         this.skillCriteriaList[i].qlfctnCriteriaName
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase()) ||
  //         this.skillCriteriaList[i].qlfctnCriteriaDesc
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase())
  //       ) {
  //         this.excelDataList.push({
  //           skill_Group: this.skillCriteriaList[i].qlfctnName,
  //           skill_Title: this.skillCriteriaList[i].qlfctnCriteriaName,
  //           skill_Title_Description: this.skillCriteriaList[i]
  //             .qlfctnCriteriaDesc
  //         });
  //       }
  //     }

  //     if (this.excelDataList.length > 0) {
  //       //alert("Filter List " + this.excelDataList.length);

  //       this.excelExportService.export(
  //         this.excelDataContent,
  //         new IgxExcelExporterOptions("skillFilterExcel")
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
