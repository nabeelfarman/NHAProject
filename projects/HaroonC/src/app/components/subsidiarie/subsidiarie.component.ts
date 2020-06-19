import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError, filter } from "rxjs/operators";
import { AppComponent } from "../../../../../../src/app/app.component";
import { OrderPipe } from "ngx-order-pipe";
// import * as jsPDF from 'jspdf';
// import {
//   IgxExcelExporterOptions,
//   IgxExcelExporterService,
//   IgxGridComponent,
//   IgxCsvExporterService,
//   IgxCsvExporterOptions,
//   CsvFileTypes
// } from "igniteui-angular";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
// import { forEach } from '@angular/router/src/utils/collection';

//----------------------------------------------------------------------------//
//-------------------Working of this typescript file are as follows-----------//
//-------------------Getting Subsidiary data into main table -------------------//
//-------------------Add new Subsidiary into database --------------------------//
//-------------------Add new city into database --------------------------//
//-------------------Update Subsidiary into database ---------------------------//
//-------------------Delete Subsidiary from database ---------------------------//
//-------------------Export into PDF, CSV, Excel -----------------------------//
//-------------------Function for email validation -----------------------------//
//-------------------For sorting the record-----------------------------//
//----------------------------------------------------------------------------//

declare var $: any;
//declare// function showLoader(): any;

@Component({
  selector: "app-subsidiarie",
  templateUrl: "./subsidiarie.component.html",
  styleUrls: ["./subsidiarie.component.scss"]
})
export class SubsidiarieComponent implements OnInit {
  //public contactForm: FormGroup;

  // areaCode = false;
  // mobileNetworkCode = false;

  subsidiaryBox = true;

  serverUrl = "http://localhost:42904/";
  tokenKey = "token";

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

  // list for excel data
  excelDataList = [];

  contactType = [];
  countryList = [];
  addressType = [];
  emailType = [];
  countryListForAddress = [];
  provinceList = [];
  districtList = [];
  cityList = [];
  businessTypeList = [];

  //* variables for display values on page

  //*Variables for NgModels
  tblSearch;
  dSubsidiaryId = "";
  subsidiaryId = "";
  cityName = "";
  subsidiaryTitle = "";
  ntn = "";
  strn = "";
  cmbSubsidiaryType = "";
  website = "";
  agreement = "";
  representator = "";

  repAddress = "";
  repMobile = "";
  repEmail = "";

  txtdPassword = "";
  txtdPin = "";

  //* variables for pagination and orderby pipe
  p = 1;
  order = "info.name";
  reverse = false;
  sortedCollection: any[];
  itemPerPage = "10";

  //address Detail
  addressDetail = [
    {
      id: 0,
      addressType: "",
      address: "",
      countryCode: "",
      provinceCode: "",
      districtCode: "",
      cityCode: "",
      cntryLst: [], // this.countryListForAddress,
      provinceList: [], // this.provinceList,
      districtList: [], // this.districtList,
      cityList: [] //this.cityList
    }
  ];

  //contact Detail
  contactDetail = [
    {
      id: 0,
      contactType: "",
      countryCode: "",
      contactCode: "",
      areaCode: true,
      mobileCode: false,
      contactNumber: "",
      mobileNumber: ""
    }
  ];

  //Emails Detail
  emailDetail = [
    {
      id: 0,
      type: "",
      email: ""
    }
  ];

  subsidiaryDetail; // = [];

  constructor(
    private toastr: ToastrManager,
    private http: HttpClient,
    private app: AppComponent,
    // private excelExportService: IgxExcelExporterService,
    // private csvExportService: IgxCsvExporterService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.getSubsidiaryDetail();
    this.getAddressTypes();
    this.getCountry();
    this.getProvince();
    this.getDistrict();
    this.getCity();
    this.getContactTypes();
    this.getEmailTypes();
    this.getBusinessTypes();
  }

  // // @ViewChild("excelDataContent") public excelDataContent: IgxGridComponent; //For excel
  @ViewChild("exportPDF") public exportPDF: ElementRef;

  //function for get all saved subsidiaries from db
  getSubsidiaryDetail() {
    // var Token = localStorage.getItem(this.tokenKey);

    // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getSubsidiary", { headers: reqHeader })
      .subscribe((data: any) => {
        this.subsidiaryDetail = data;
      });
  }

  //function for get all saved district
  getCity() {
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getCity", { headers: reqHeader })
      .subscribe((data: any) => {
        for (var i = 0; i < data.length; i++) {
          this.cityList.push({
            label: data[i].thslName,
            value: data[i].thslCd
          });
        }
      });
  }

  //function for get all saved district
  getDistrict() {
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getDistrict", { headers: reqHeader })
      .subscribe((data: any) => {
        for (var i = 0; i < data.length; i++) {
          this.districtList.push({
            label: data[i].districtName,
            value: data[i].districtCd
          });
        }
      });
  }

  //function for get all saved province
  getProvince() {
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getProvince", { headers: reqHeader })
      .subscribe((data: any) => {
        for (var i = 0; i < data.length; i++) {
          this.provinceList.push({
            label: data[i].prvinceName,
            value: data[i].prvncCd
          });
        }
      });
  }

  //function for get all saved countrys
  getCountry() {
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getCountry", { headers: reqHeader })
      .subscribe((data: any) => {
        for (var i = 0; i < data.length; i++) {
          this.countryListForAddress.push({
            label: data[i].cntryName,
            value: data[i].cntryCd.trim()
          });

          this.countryList.push({
            label: data[i].cntryName + " " + data[i].cntryCallingCd,
            value: data[i].cntryCallingCd
          });
        }
      });
  }

  //function for get all saved address types
  getAddressTypes() {
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getAddressType", { headers: reqHeader })
      .subscribe((data: any) => {
        for (var i = 0; i < data.length; i++) {
          this.addressType.push({
            label: data[i].addressTypeName,
            value: data[i].addressTypeCd
          });
        }
      });
  }

  //function for get all saved telephone types
  getContactTypes() {
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getTelephoneType", { headers: reqHeader })
      .subscribe((data: any) => {
        for (var i = 0; i < data.length; i++) {
          this.contactType.push({
            label: data[i].teleTypeName,
            value: data[i].teleTypeCd
          });
        }
      });
  }

  //function for get all saved email types
  getEmailTypes() {
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getEmailType", { headers: reqHeader })
      .subscribe((data: any) => {
        for (var i = 0; i < data.length; i++) {
          this.emailType.push({
            label: data[i].emailTypeName,
            value: data[i].emailTypeCd
          });
        }
      });
  }

  //function for get all saved telephone type types
  getBusinessTypes() {
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getBusinessType", { headers: reqHeader })
      .subscribe((data: any) => {
        this.businessTypeList = data;
      });
  }

  //Function for save and update currency
  save() {
    if (this.subsidiaryTitle.trim() == "") {
      this.toastr.errorToastr("Please enter subsidiary title", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.ntn.trim() == "" || this.ntn.length < 8) {
      this.toastr.errorToastr("Please enter NTN", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.strn.trim() == "" || this.strn.length < 10) {
      this.toastr.errorToastr("Please enter STRM", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.cmbSubsidiaryType == "") {
      this.toastr.errorToastr("Please enter subsidiary type", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.website.trim() == "") {
      this.toastr.errorToastr("Please enter website", "Error", {
        toastTimeout: 2500
      });
      return false;
    }
    // else if (this.agreement == '') {
    //     this.toastr.errorToastr('Please attach agreement copy', 'Error', { toastTimeout: (2500) });
    //     return false;
    // }
    // address type conditions
    else if (this.addressDetail.length == 0) {
      this.toastr.errorToastr("Please Add Subsidiary Address Info", "Error", {
        toastTimeout: 2500
      });
      return false;
    }
    // contact type conditions
    else if (this.contactDetail.length == 0) {
      this.toastr.errorToastr(
        "Please Add Subsidiary Contact Info Type",
        "Error",
        { toastTimeout: 2500 }
      );
      return false;
    }
    // email type conditions
    else if (this.emailDetail.length == 0) {
      this.toastr.errorToastr("Please Add Subsidiary Email Info", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.representator.trim() == "") {
      this.toastr.errorToastr("Please enter representator name", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.repAddress.trim() == "") {
      this.toastr.errorToastr("Please enter representator address", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.repMobile == "" || this.repMobile.length < 11) {
      this.toastr.errorToastr("Please enter representator mobile no", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.isEmail(this.repEmail.trim()) == false) {
      this.toastr.errorToastr("Invalid representator email address", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else {
      // address type conditions for subsidiary
      if (this.addressDetail.length > 0) {
        for (let i = 0; i < this.addressDetail.length; i++) {
          if (this.addressDetail[i].addressType == "") {
            this.toastr.errorToastr("Please Select Address Type", "Error", {
              toastTimeout: 2500
            });
            return false;
          } else if (this.addressDetail[i].address.trim() == "") {
            this.toastr.errorToastr("Please Enter Address", "Error", {
              toastTimeout: 2500
            });
            return false;
          } else if (this.addressDetail[i].countryCode == "") {
            this.toastr.errorToastr("Please Select Country", "Error", {
              toastTimeout: 2500
            });
            return false;
          } else if (this.addressDetail[i].provinceCode == "") {
            this.toastr.errorToastr("Please Select Province", "Error", {
              toastTimeout: 2500
            });
            return false;
          } else if (this.addressDetail[i].districtCode == "") {
            this.toastr.errorToastr("Please Select District", "Error", {
              toastTimeout: 2500
            });
            return false;
          } else if (this.addressDetail[i].cityCode == "") {
            this.toastr.errorToastr("Please Select City", "Error", {
              toastTimeout: 2500
            });
            return false;
          }
        }
      }

      // contact type conditions for subsidiary
      if (this.contactDetail.length > 0) {
        for (let i = 0; i < this.contactDetail.length; i++) {
          if (this.contactDetail[i].contactType == "") {
            this.toastr.errorToastr("Please Select Contact Type", "Error", {
              toastTimeout: 2500
            });
            return false;
          } else if (this.contactDetail[i].countryCode == "countryCode") {
            this.toastr.errorToastr("Please Select Country Code", "Error", {
              toastTimeout: 2500
            });
            return false;
          } else if (this.contactDetail[i].contactNumber.trim() == "") {
            this.toastr.errorToastr("Please Enter Contact Number", "Error", {
              toastTimeout: 2500
            });
            return false;
          }
        }
      }

      // email type conditions for subsidiary
      if (this.emailDetail.length > 0) {
        for (let i = 0; i < this.emailDetail.length; i++) {
          if (this.emailDetail[i].type == "") {
            this.toastr.errorToastr("Please Select Email Type", "Error", {
              toastTimeout: 2500
            });
            return false;
          } else if (this.emailDetail[i].email.trim() == "") {
            this.toastr.errorToastr("Please Enter Email", "Error", {
              toastTimeout: 2500
            });
            return false;
          } else if (this.isEmail(this.emailDetail[i].email) == false) {
            this.toastr.errorToastr("Invalid email", "Error", {
              toastTimeout: 2500
            });
            return false;
          }
        }
      }

      if (this.subsidiaryId != "") {
        this.app.showSpinner();
        this.toastr.successToastr("updated successfully", "Success", {
          toastTimeout: 2500
        });
        this.clear();
        $("#subsidiaryModal").modal("hide");
        this.app.hideSpinner();
        return false;

        var updateData = {
          ID: this.subsidiaryId,
          Password: this.txtdPassword,
          PIN: this.txtdPin
        };

        var token = localStorage.getItem(this.tokenKey);

        var reqHeader = new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        });

        this.http
          .put(this.serverUrl + "api/pwCreate", updateData, {
            headers: reqHeader
          })
          .subscribe((data: any) => {
            if (data.msg != undefined) {
              this.toastr.errorToastr(data.msg, "Error!", {
                toastTimeout: 2500
              });
              return false;
            } else {
              this.toastr.successToastr(
                "Record updated Successfully",
                "Success!",
                { toastTimeout: 2500 }
              );
              $("#actionModal").modal("hide");
              return false;
            }
          });
      } else {
        var saveData = {
          OrgName: this.subsidiaryTitle,
          OrgNTN: this.ntn,
          OrgSTRNNo: this.strn,
          OrgWebsite: this.website,
          OrgTypeCd: Number(this.cmbSubsidiaryType),
          addressList: JSON.stringify(this.addressDetail),
          contactList: JSON.stringify(this.contactDetail),
          emailList: JSON.stringify(this.emailDetail),
          representator: this.representator,
          repAddress: this.repAddress,
          repMobile: this.repMobile,
          repEmail: this.repEmail
        };

        //var token = localStorage.getItem(this.tokenKey);

        //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

        this.http
          .post(this.serverUrl + "api/saveSubsidiary", saveData, {
            headers: reqHeader
          })
          .subscribe((data: any) => {
            if (data.msg != "Done") {
              this.toastr.errorToastr(data.msg, "Error!", {
                toastTimeout: 2500
              });
              return false;
            } else {
              this.toastr.successToastr(
                "Record Saved Successfully",
                "Success!",
                { toastTimeout: 2500 }
              );
              $("#actionModal").modal("hide");
              return false;
            }
          });
      }
    }
  }

  //function for empty all fields
  clear() {
    this.dSubsidiaryId = "";
    this.subsidiaryId = "";
    this.cityName = "";
    this.subsidiaryTitle = "";
    this.ntn = "";
    this.strn = "";
    this.cmbSubsidiaryType = "";
    this.website = "";
    this.agreement = "";

    //empty addres, contact and email detail for subsidiary
    this.addressDetail = [
      {
        id: 0,
        addressType: "",
        address: "",
        countryCode: "",
        provinceCode: "",
        districtCode: "",
        cityCode: "",
        cntryLst: this.countryListForAddress,
        provinceList: this.provinceList,
        districtList: this.districtList,
        cityList: this.cityList
      }
    ];

    this.contactDetail = [
      {
        id: 0,
        contactType: "",
        countryCode: "",
        contactCode: "",
        areaCode: true,
        mobileCode: false,
        contactNumber: "",
        mobileNumber: ""
      }
    ];

    this.emailDetail = [
      {
        id: 0,
        type: "",
        email: ""
      }
    ];

    this.representator = "";
    this.repAddress = "";
    this.repMobile = "";
    this.repEmail = "";

    this.txtdPassword = "";
    this.txtdPin = "";
  }

  //function for edit existing currency
  edit(item) {
    this.subsidiaryId = item.subsidiaryId;
    this.subsidiaryTitle = item.subsidiaryTitle;
    this.ntn = item.ntn;
    this.strn = item.strn;
    this.cmbSubsidiaryType = item.subsidiaryType;
    this.website = item.website;
    this.agreement = item.agreement;
  }

  //functions for delete currency
  deleteTemp(item) {
    this.clear();
    this.dSubsidiaryId = item.subsidiaryDetailId;
  }

  delete() {
    if (this.txtdPassword == "") {
      this.toastr.errorToastr("Please enter password", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.txtdPin == "") {
      this.toastr.errorToastr("Please enter PIN", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.dSubsidiaryId == "") {
      this.toastr.errorToastr("Invalid delete request", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else {
      this.app.showSpinner();
      this.app.hideSpinner();
      this.toastr.successToastr("Deleted successfully", "Success", {
        toastTimeout: 2500
      });
      this.clear();

      $("#closeDeleteModel").click();

      return false;

      var data = {
        ID: this.dSubsidiaryId,
        Password: this.txtdPassword,
        PIN: this.txtdPin
      };

      var token = localStorage.getItem(this.tokenKey);

      var reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      });

      this.http
        .put(this.serverUrl + "api/pwCreate", data, { headers: reqHeader })
        .subscribe((data: any) => {
          if (data.msg != undefined) {
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 2500 });
            return false;
          } else {
            this.toastr.successToastr(
              "Record Deleted Successfully",
              "Success!",
              { toastTimeout: 2500 }
            );
            $("#actionModal").modal("hide");
            return false;
          }
        });
    }
  }

  //function for email validation
  isEmail(email) {
    return this.app.validateEmail(email);
  }

  //function for sort table data
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  // For Print Purpose
  printDiv() {
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

    setTimeout(function() {
      window.frames["frame1"].focus();
      window.frames["frame1"].print();
      frame1.remove();
    }, 500);
  }

  // For PDF Download
  downloadPDF() {
    // var doc = new jsPDF("p", "pt", "A4"),
    //     source = $("#printArea")[0],
    //     margins = {
    //         top: 75,
    //         right: 30,
    //         bottom: 50,
    //         left: 30,
    //         width: 50
    //     };
    // doc.fromHTML(
    //     source, // HTML string or DOM elem ref.
    //     margins.left, // x coord
    //     margins.top,
    //     {
    //         // y coord
    //         width: margins.width // max width of content on PDF
    //     },
    //     function (dispose) {
    //         // dispose: object with X, Y of the last line add to the PDF
    //         //          this allow the insertion of new lines after html
    //         doc.save("Test.pdf");
    //     },
    //     margins
    // );
  }

  //For CSV File
  // public downloadCSV() {
  //   // case 1: When tblSearch is empty then assign full data list
  //   if (this.tblSearch == "") {
  //     var completeDataList = [];
  //     for (var i = 0; i < this.subsidiaryDetail.length; i++) {
  //       completeDataList.push({
  //         subsidiaryTitle: this.subsidiaryDetail[i].subsidiaryTitle,
  //         subsidiaryType: this.subsidiaryDetail[i].subsidiaryType,
  //         representator: this.subsidiaryDetail[i].representator,
  //         mobile: this.subsidiaryDetail[i].mobile,
  //         website: this.subsidiaryDetail[i].website
  //       });
  //     }
  //     this.csvExportService.exportData(
  //       completeDataList,
  //       new IgxCsvExporterOptions("SubsidiaryCompleteCSV", CsvFileTypes.CSV)
  //     );
  //   }
  //   // case 2: When tblSearch is not empty then assign new data list
  //   else if (this.tblSearch != "") {
  //     var filteredDataList = [];
  //     for (var i = 0; i < this.subsidiaryDetail.length; i++) {
  //       if (
  //         this.subsidiaryDetail[i].subsidiaryTitle
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase()) ||
  //         this.subsidiaryDetail[i].subsidiaryType
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase()) ||
  //         this.subsidiaryDetail[i].representator
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase()) ||
  //         this.subsidiaryDetail[i].mobile
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase()) ||
  //         this.subsidiaryDetail[i].website
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase())
  //       ) {
  //         filteredDataList.push({
  //           subsidiaryTitle: this.subsidiaryDetail[i].subsidiaryTitle,
  //           subsidiaryType: this.subsidiaryDetail[i].subsidiaryType,
  //           representator: this.subsidiaryDetail[i].representator,
  //           mobile: this.subsidiaryDetail[i].mobile,
  //           website: this.subsidiaryDetail[i].website
  //         });
  //       }
  //     }

  //     if (filteredDataList.length > 0) {
  //       this.csvExportService.exportData(
  //         filteredDataList,
  //         new IgxCsvExporterOptions("SubsidiaryFilterCSV", CsvFileTypes.CSV)
  //       );
  //     } else {
  //       this.toastr.errorToastr("Oops! No data found", "Error", {
  //         toastTimeout: 2500
  //       });
  //     }
  //   }
  // }

  //For Exce File
  // public downloadExcel() {
  //   // case 1: When tblSearch is empty then assign full data list
  //   if (this.tblSearch == "") {
  //     for (var i = 0; i < this.subsidiaryDetail.length; i++) {
  //       this.excelDataList.push({
  //         subsidiaryTitle: this.subsidiaryDetail[i].subsidiaryTitle,
  //         subsidiaryType: this.subsidiaryDetail[i].subsidiaryType,
  //         representator: this.subsidiaryDetail[i].representator,
  //         mobile: this.subsidiaryDetail[i].mobile,
  //         website: this.subsidiaryDetail[i].website
  //       });
  //     }
  //     this.excelExportService.export(
  //       this.excelDataContent,
  //       new IgxExcelExporterOptions("SubsidiaryCompleteExcel")
  //     );
  //     this.excelDataList = [];
  //   }
  //   // case 2: When tblSearch is not empty then assign new data list
  //   else if (this.tblSearch != "") {
  //     for (var i = 0; i < this.subsidiaryDetail.length; i++) {
  //       if (
  //         this.subsidiaryDetail[i].subsidiaryTitle
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase()) ||
  //         this.subsidiaryDetail[i].subsidiaryType
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase()) ||
  //         this.subsidiaryDetail[i].representator
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase()) ||
  //         this.subsidiaryDetail[i].mobile
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase()) ||
  //         this.subsidiaryDetail[i].website
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase())
  //       ) {
  //         this.excelDataList.push({
  //           subsidiaryTitle: this.subsidiaryDetail[i].subsidiaryTitle,
  //           subsidiaryType: this.subsidiaryDetail[i].subsidiaryType,
  //           representator: this.subsidiaryDetail[i].representator,
  //           mobile: this.subsidiaryDetail[i].mobile,
  //           website: this.subsidiaryDetail[i].website
  //         });
  //       }
  //     }

  //     if (this.excelDataList.length > 0) {
  //       this.excelExportService.export(
  //         this.excelDataContent,
  //         new IgxExcelExporterOptions("SubsidiaryFilterExcel")
  //       );
  //       this.excelDataList = [];
  //     } else {
  //       this.toastr.errorToastr("Oops! No data found", "Error", {
  //         toastTimeout: 2500
  //       });
  //     }
  //   }
  // }

  onContactChange(contactType, item) {
    if (contactType == "1") {
      item.areaCode = true;
      item.mobileCode = false;
    } else if (contactType == "2") {
      item.areaCode = true;
      item.mobileCode = false;
    } else if (contactType == "3") {
      item.areaCode = false;
      item.mobileCode = true;
    } else {
      return;
    }
  }

  //Function for add new contact row
  addContact() {
    this.contactDetail.push({
      id: 0,
      contactType: "",
      countryCode: "",
      contactCode: "",
      areaCode: true,
      mobileCode: false,
      contactNumber: "",
      mobileNumber: ""
    });
  }

  //Function for add new address row
  addAddress() {
    this.addressDetail.push({
      id: 0,
      addressType: "",
      address: "",
      countryCode: "",
      provinceCode: "",
      districtCode: "",
      cityCode: "",
      cntryLst: this.countryListForAddress,
      provinceList: this.provinceList,
      districtList: this.districtList,
      cityList: this.cityList
    });
  }

  //Function for add new email row
  addEmail() {
    this.emailDetail.push({
      id: 0,
      type: "",
      email: ""
    });
  }

  //Deleting contact row
  removeContact(item) {
    this.contactDetail.splice(item, 1);
  }

  //Deleting address row
  removeAddress(item) {
    this.addressDetail.splice(item, 1);
  }

  //Deleting address row
  removeEmail(item) {
    this.emailDetail.splice(item, 1);
  }

  getFilterItem(item) {
    //return this.tempRoleList.filter(x => x.parentErpObjctCd == item && x.erpObjctTypeCd == 2);
  }
}
