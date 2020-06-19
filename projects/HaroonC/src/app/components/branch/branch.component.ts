import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgModule,
  EventEmitter,
  Output,
} from "@angular/core";
import { ToastrManager } from "ng6-toastr-notifications";
import { AppComponent } from "../../../../../../src/app/app.component";
import { HttpHeaders, HttpClient } from "@angular/common/http";

import { ConfigAddressComponent } from "src/app/components/config-address/config-address.component";
import { ConfigContactComponent } from "src/app/components/config-contact/config-contact.component";

//import { SelectItem } from 'primeng/api';

// import * as jsPDF from 'jspdf';
// import {
//   IgxExcelExporterOptions,
//   IgxExcelExporterService,
//   IgxGridComponent,
//   IgxCsvExporterService,
//   IgxCsvExporterOptions,
//   CsvFileTypes
// } from "igniteui-angular";
import { FormArray, Validators, FormBuilder, FormGroup } from "@angular/forms";
import { NgForOf } from "@angular/common";

//import { AddressComponent } from 'src/app/shared/address/address.component';

// import { DepartmentComponent } from "src/app/components/department/department.component";

import { ValidationAddressService } from "../../shared/services/validation-address.service"; //'src/app/shared/services/validation-address.service';
// import { AddressComponent } from '../../shared/address/address.component';

//----------------------------------------------------------------------------//
//-------------------Working of this typescript file are as follows-----------//
//-------------------Getting branch data into main table -------------------//
//-------------------Add new branch into database --------------------------//
//-------------------Add new city into database --------------------------//
//-------------------Update branch into database ---------------------------//
//-------------------Delete branch from database ---------------------------//
//-------------------Export into PDF, CSV, Excel -----------------------------//
//-------------------Function for email validation -----------------------------//
//-------------------For sorting the record-----------------------------//
//----------------------------------------------------------------------------//

declare var $: any;

// interface City {
//   label: string;
//   countryCode: string;
// }

@Component({
  // providers: [AddressComponent],
  selector: "app-branch",
  templateUrl: "./branch.component.html",
  styleUrls: ["./branch.component.scss"],
})
export class BranchComponent implements OnInit {
  @ViewChild(ConfigAddressComponent) shrd_adrs: ConfigAddressComponent;
  @ViewChild(ConfigContactComponent) shrd_cntct: ConfigContactComponent;

  @Output() myEvent = new EventEmitter();

  // public contactForm: FormGroup;
  // public addressForm: FormGroup;

  //areaCode = false;
  //mobileNetworkCode = false;

  branchBox = true;

  //work = false;
  //shipping = false;
  //postal = false;

  serverUrl = "http://ambit-erp.southeastasia.cloudapp.azure.com:9040/";
  //serverUrl = "http://localhost:9040/";
  tokenKey = "token";

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  // list for excel data
  excelDataList = [];
  contactTypeList = [];
  countryList = [];
  areaList = [];
  networkList = [];
  addressTypeList = [];
  emailTypeList = [];

  countryListForAddress = [];
  provinceList = [];
  districtList = [];

  //** Dropdown (temporary lists) for filters */
  //dropCountryList = [];
  dropProvinceList = [];
  dropDistrictList = [];
  dropCityList = [];

  //*Page Models
  branchId = "";
  branchType = "";
  branchTitle = "";

  branchCity = "";

  branchWebsite = "";

  branchAddressType = "";
  branchWork = "";
  branchShipping = "";
  branchPostal = "";

  dbranchId = "";
  cmpnyId = "";
  delFlag: boolean;

  addressType = "";
  address = "";
  country = "";
  city = "";
  zipCode = "";

  srchCntry = "";
  srchCity = "";
  cntryList = [];
  cityList = [];
  addressList = [];

  //*NgModel For Searching textboxes
  tblSearch = "";

  menuComboText = "";

  cmbCompany = "";
  txtBranch = "";
  branchHeading = "Add";

  //*City Modal Window Models
  cityName = "";

  //*Delete Modal Window Models
  userPassword = "";
  userPINCode = "";

  //* dropdown search ng-models
  dropSearchBranch = "";

  //* variables for pagination and orderby pipe
  p = 1;
  order = "info.label";
  reverse = false;
  sortedCollection: any[];
  itemPerPage = "10";

  branches = [];
  branchDetail = [];

  companies = [];

  //contact Detail
  contactDetail = [
    {
      contactId: 0,
      contactType: "",
      countryCode: "",
      contactCode: "",
      areaCode: true,
      mobileCode: false,
      contactNumber: "",
      mobileNumber: "",
    },
  ];

  //address Detail
  addressDetail = [
    {
      addressType: "",
      address: "",
      countryName: "",
      countryCode: "",
      provinceList: "",
      provinceCode: "",
      districtList: "",
      districtCode: "",
      cityList: "",
      cityCode: "",
    },
  ];

  //Emails Detail
  emailDetail = [
    {
      type: "",
      email: "",
    },
  ];

  //*use in city combobox
  cities = [
    { ctyId: "1", ctyName: "Islamabad" },
    { ctyId: "2", ctyName: "Karachi" },
    { ctyId: "3", ctyName: "Lahore" },
    { ctyId: "4", ctyName: "Quetta" },
  ];

  constructor(
    public toastr: ToastrManager,
    private app: AppComponent,
    private http: HttpClient,
    // private excelExportService: IgxExcelExporterService,
    // private csvExportService: IgxCsvExporterService,
    private fb: FormBuilder,
    private validObj: ValidationAddressService // private addObj: AddressComponent
  ) {}

  ngOnInit() {
    this.getCompany();
    this.getBranches();
    this.getBranchDetail();

    this.getCountry();
    this.getCity();
  }

  // @ViewChild("excelDataContent") public excelDataContent: IgxGridComponent; //For excel
  @ViewChild("exportPDF") public exportPDF: ElementRef; // for pdf

  //@ViewChild("addressObj") public addressObj: AddressComponent;

  //* get all branch data
  getCompany() {
    //return false;

    var Token = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "api/getCompany", { headers: reqHeader })
      .subscribe((data: any) => {
        this.companies = data;
      });
  }

  getCity() {
    //return false;

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getCity", { headers: reqHeader })
      .subscribe((data: any) => {
        this.cityList = data;
      });
  }

  getCountry() {
    //return false;

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.app.showSpinner();

    this.http
      .get(this.serverUrl + "api/getCountry", { headers: reqHeader })
      .subscribe((data: any) => {
        this.cntryList = data;
        this.app.hideSpinner();
      });
  }

  //* get all branch data
  getBranches() {
    this.app.showSpinner();
    // var Token = localStorage.getItem(this.tokenKey);

    // var reqHeader = new HttpHeaders({
    //   "Content-Type": "application/json",
    //   Authorization: "Bearer " + Token
    // });

    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
    });

    this.http
      .get(this.serverUrl + "api/getBranch", { headers: reqHeader })
      .subscribe((data: any) => {
        this.branches = data;
        this.app.hideSpinner();
      });
  }

  //* get all branch data
  getBranchDetail() {
    // var Token = localStorage.getItem(this.tokenKey);

    // var reqHeader = new HttpHeaders({
    //   "Content-Type": "application/json",
    //   Authorization: "Bearer " + Token
    // });

    this.app.showSpinner();

    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
    });

    this.http
      .get(this.serverUrl + "api/getBranchDetail", { headers: reqHeader })
      .subscribe((data: any) => {
        this.branchDetail = data;
        this.app.hideSpinner();
      });
  }

  clearCty() {
    this.cityName = "";
  }

  onBranchClick() {
    this.dropSearchBranch = "";
  }

  //* Function for saving and updating the data
  saveBranch() {
    if (this.cmbCompany == "") {
      this.toastr.errorToastr("Please Select Company", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtBranch == "") {
      this.toastr.errorToastr("Please Enter Branch", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.address.trim() == "") {
      this.toastr.errorToastr("Please Enter Address", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.country == "") {
      this.toastr.errorToastr("Please Enter Country", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.city == "") {
      this.toastr.errorToastr("Please Enter City", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.zipCode == "") {
      this.toastr.errorToastr("Please Enter Zip Code", "Error", {
        toastTimeout: 2500,
      });
      return false;
    }
    // contact type conditions
    else if (this.shrd_cntct.contactList.length == 0) {
      this.toastr.errorToastr("Please Add Contact Info Type", "Error", {
        toastTimeout: 2500,
      });
      return false;
    }
    // email type conditions
    else if (this.shrd_cntct.emailList.length == 0) {
      this.toastr.errorToastr("Please Add Email Info Type", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      if (this.addressList.length == 0) {
        this.addressList.push({
          contactDetailCode: 0,
          addressId: 0,
          addressType: 2,
          address: this.address,
          cityCode: 1,
          districtCode: this.city,
          provinceCode: 6,
          countryCode: this.country,

          addressTypeName: "",
          cntryName: "",
          districtName: "",

          zipCode: this.zipCode,
          status: 0,
          IDelFlag: 0,
        });
      } else {
        this.addressList[0].address = this.address;
        this.addressList[0].districtCode = this.city;
        this.addressList[0].countryCode = this.country;
        this.addressList[0].zipCode = this.zipCode;
      }

      if (this.branchId != "") {
        this.app.showSpinner();

        var updateData = {
          branchId: this.branchId,
          companyId: this.cmbCompany,
          branchName: this.txtBranch,
          address: JSON.stringify(this.addressList),
          telephone: JSON.stringify(this.shrd_cntct.contactList),
          email: JSON.stringify(this.shrd_cntct.emailList),
        };

        var reqHeader = new HttpHeaders({
          "Content-Type": "application/json",
        });

        // var token = localStorage.getItem(this.tokenKey);

        // var reqHeader = new HttpHeaders({
        //   "Content-Type": "application/json",
        //   Authorization: "Bearer " + token
        // });

        this.http
          .put(this.serverUrl + "api/updateBranch", updateData, {
            headers: reqHeader,
          })
          .subscribe((data: any) => {
            if (data.msg != "Record Updated Successfully!") {
              this.toastr.errorToastr(data.msg, "Error!", {
                toastTimeout: 2500,
              });
              this.app.hideSpinner();
              return false;
            } else {
              this.toastr.successToastr(data.msg, "Success!", {
                toastTimeout: 2500,
              });
              this.clear();
              this.getBranchDetail();
              this.getBranches();
              this.app.hideSpinner();
              return false;
            }
          });
      } else {
        this.app.showSpinner();

        var saveData = {
          companyId: this.cmbCompany,
          branchName: this.txtBranch,
          address: JSON.stringify(this.addressList),
          telephone: JSON.stringify(this.shrd_cntct.contactList),
          email: JSON.stringify(this.shrd_cntct.emailList),
        };

        // var token = localStorage.getItem(this.tokenKey);

        // var reqHeader = new HttpHeaders({
        //   "Content-Type": "application/json",
        //   Authorization: "Bearer " + token
        // });

        var reqHeader = new HttpHeaders({
          "Content-Type": "application/json",
        });

        this.http
          .post(this.serverUrl + "api/saveBranch", saveData, {
            headers: reqHeader,
          })
          .subscribe((data: any) => {
            if (data.msg != "Record Saved Successfully!") {
              this.toastr.errorToastr(data.msg, "Error!", {
                toastTimeout: 2500,
              });
              this.app.hideSpinner();
              return false;
            } else {
              this.toastr.successToastr(data.msg, "Success!", {
                toastTimeout: 2500,
              });
              this.clear();
              this.getBranchDetail();
              this.getBranches();
              this.app.hideSpinner();
              return false;
            }
          });
      }
    }
  }

  //*Clear the input fields
  clear() {
    this.branchHeading = "Add";
    this.cmbCompany = "";
    this.txtBranch = "";
    this.branchId = "";

    this.address = "";
    this.country = "";
    this.city = "";
    this.zipCode = "";
    this.srchCity = "";
    this.srchCntry = "";

    this.addressList = [];
    this.shrd_cntct.contactList = [];
    this.shrd_cntct.emailList = [];
  }

  //*Edit Function
  edit(item) {
    this.clear();

    var addressList = [];
    var emailList = [];
    var telephoneList = [];

    if (item.delFlag == 0) {
      this.branchHeading = "Edit";
      for (var i = 0; i < this.branchDetail.length; i++) {
        if (item.locationCd == this.branchDetail[i].locationCd) {
          if (this.cmbCompany == "") {
            this.cmbCompany = this.branchDetail[i].cmpnyID;
            this.txtBranch = this.branchDetail[i].locationName;
            this.branchId = this.branchDetail[i].locationCd;
          }

          if (this.branchDetail[i].addressTypeCd != 0) {
            addressList.push({
              contactDetailCode: this.branchDetail[i].cntctDetailCd,
              addressId: 0,
              addressType: this.branchDetail[i].addressTypeCd,
              address: this.branchDetail[i].addressLine1,
              cityCode: 1,
              districtCode: this.branchDetail[i].districtCd,
              provinceCode: 6,
              countryCode: this.branchDetail[i].addCntryCd,
              zipCode: 0,
              status: 1,
            });
          } else if (this.branchDetail[i].teleTypeCd != 0) {
            telephoneList.push({
              contactDetailCode: this.branchDetail[i].cntctDetailCd,
              telId: 0,
              contactType: this.branchDetail[i].teleTypeCd,
              status: 1,
              contactNumber: this.branchDetail[i].teleNo,
              mobileNumber: "",
              countryCode: 0,
            });
          } else if (this.branchDetail[i].emailTypeCd != 0) {
            emailList.push({
              contactDetailCode: this.branchDetail[i].cntctDetailCd,
              emailId: 0,
              type: this.branchDetail[i].emailTypeCd,
              status: 1,
              email: this.branchDetail[i].emailAddrss,
            });
          }
        }
      }

      this.address = addressList[0].address;
      this.country = addressList[0].countryCode;
      this.city = addressList[0].cityCode;
      this.zipCode = addressList[0].zipCode;

      this.addressList = addressList;
      this.shrd_cntct.contactList = telephoneList;
      this.shrd_cntct.emailList = emailList;
    }
  }

  //*get the "id" of the delete entry
  deleteTemp(item) {
    this.clear();

    this.dbranchId = item.locationCd;
    this.cmpnyId = item.cmpnyID;

    if (this.app.pin != "") {
      if (item.delFlag == false) {
        this.delFlag = true;
      } else if (item.delFlag == true) {
        this.delFlag = false;
      }
    }

    this.generatePin();
  }

  change(e, i) {
    if (this.app.pin == "") {
      if (i.delFlag == false) {
        e.source.checked = false;
      } else if (i.delFlag == true) {
        e.source.checked = true;
      }
    }
  }

  /*** Pin generation or Delete Role  ***/
  generatePin() {
    //* check if global variable is empty
    if (this.app.pin != "") {
      //* Initialize List and Assign data to list. Sending list to api
      this.app.showSpinner();

      var branchData = {
        companyId: this.cmpnyId,
        branchId: this.dbranchId,
        DelFlag: this.delFlag,
      };

      this.http
        .put(this.serverUrl + "api/deactiveBranch", branchData)
        .subscribe((data: any) => {
          if (
            data.msg != "Branch Successfully Activated!" &&
            data.msg != "Branch Successfully Deactivated!"
          ) {
            this.app.hideSpinner();
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 5000 });
            this.getBranches();
            this.getBranchDetail();
            return false;
          } else {
            this.app.hideSpinner();
            this.app.pin = "";
            this.toastr.successToastr(data.msg, "Success!", {
              toastTimeout: 2500,
            });
            this.getBranches();
            this.getBranchDetail();
            return false;
          }
        });
    } else {
      this.app.genPin();
    }
  }

  //* function for email validation
  isEmail(email) {
    return this.app.validateEmail(email);
  }

  //*function for sort table data
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

  // For PDF Download
  downloadPDF() {
    // var doc = new jsPDF("p", "pt", "A4"),
    //   source = $("#printArea")[0],
    //   margins = {
    //     top: 75,
    //     right: 30,
    //     bottom: 50,
    //     left: 30,
    //     width: 50
    //   };
    // doc.fromHTML(
    //   source, // HTML string or DOM elem ref.
    //   margins.left, // x coord
    //   margins.top,
    //   {
    //     // y coord
    //     width: margins.width // max width of content on PDF
    //   },
    //   function (dispose) {
    //     // dispose: object with X, Y of the last line add to the PDF
    //     //          this allow the insertion of new lines after html
    //     doc.save("Test.pdf");
    //   },
    //   margins
    // );
  }

  //For CSV File
  public downloadCSV() {
    return false;
  }

  //For Exce File
  public downloadExcel() {
    return false;
  }

  onContactChange(contactType, item) {
    if (contactType == "1" || contactType == "2" || contactType == "6") {
      item.areaCode = false;
      item.mobileCode = true;
    } else if (
      contactType == "3" ||
      contactType == "4" ||
      contactType == "5" ||
      contactType == "7"
    ) {
      item.areaCode = true;
      item.mobileCode = false;
    } else {
      return;
    }
  }

  addContact() {
    this.contactDetail.push({
      contactId: 0,
      contactType: "",
      countryCode: "",
      contactCode: "",
      areaCode: true,
      mobileCode: false,
      contactNumber: "",
      mobileNumber: "",
    });
  }

  addAddress() {
    //this.clear();
    this.addressDetail.push({
      addressType: "",
      address: "",
      countryName: "",
      countryCode: "",
      provinceList: "",
      provinceCode: "",
      districtList: "",
      districtCode: "",
      cityList: "",
      cityCode: "",
    });
  }

  addEmail() {
    this.emailDetail.push({
      type: "",
      email: "",
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

  onCountryChange(item) {
    if (item == "") {
      this.dropProvinceList = this.provinceList;
    } else {
      this.dropProvinceList = this.provinceList.filter(
        (x) => x.cntryCd == item
      );
    }
  }

  onProvinceChange(item) {
    if (item == "") {
      this.dropDistrictList = this.districtList;
    } else {
      this.dropDistrictList = this.districtList.filter(
        (x) => x.prvncCd == item
      );
    }
  }

  onDistrictChange(item) {
    if (item == "") {
      this.dropCityList = this.cityList;
    } else {
      this.dropCityList = this.cityList.filter((x) => x.districtCd == item);
    }
  }
}
