import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
} from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError, filter } from "rxjs/operators";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ToastrManager } from "ng6-toastr-notifications";
import { AppComponent } from "../../../../../../src/app/app.component";
import { CurrencyComponent } from "../currency/currency.component";

import { ConfigAddressComponent } from "src/app/components/config-address/config-address.component";

// import {
//   IgxExcelExporterOptions,
//   IgxExcelExporterService,
//   IgxGridComponent,
//   IgxCsvExporterService,
//   IgxCsvExporterOptions,
//   CsvFileTypes
// } from "igniteui-angular";
// import { jsonpCallbackContext } from '@angular/common/http/src/module';

//----------------------------------------------------------------------------//
//-------------------Working of this typescript file are as follows-----------//
//-------------------Getting company data into main table -------------------//
//-------------------Add new company into database --------------------------//
//-------------------Add new partner into database --------------------------//
//-------------------Update company into database ---------------------------//
//-------------------Delete company from database ---------------------------//
//-------------------Remove partner from database ---------------------------//
//-------------------Export into PDF, CSV, Excel -----------------------------//
//-------------------Function for email validation -----------------------------//
//-------------------For sorting the record-----------------------------//
//-------------------function for hide or unhide div-----------------------------//
//----------------------------------------------------------------------------//

declare var $: any;

//Partners array
export interface Partner {
  pId: number;
  cnic: string;
  ntn: string;
  name: string;
  role: string;
  date: Date;
  share: string;
  position: string;
}

// export interface adresList {
//     addressType: string;
//     address: string,
//     countryCode: string,
//     provinceCode: string,
//     districtCode: string,
//     cityCode: string
// }

export interface cntctList {
  contactType: string;
  countryCode: string;
  contactCode: string;
  areaCode: boolean;
  mobileCode: boolean;
  contactNumber: string;
  mobileNumber: string;
}

export interface emailList {
  type: string;
  email: string;
}

@Component({
  selector: "app-new-company",
  templateUrl: "./new-company.component.html",
  styleUrls: ["./new-company.component.scss"],
})
export class NewCompanyComponent implements OnInit {
  @ViewChild(ConfigAddressComponent) child: ConfigAddressComponent;

  companyBox = true;

  // serverUrl = "https://localhost:7007/";
  serverUrl = "http://ambit-erp.southeastasia.cloudapp.azure.com:7007/";
  tokenKey = "token";

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  // list variables -----------
  excelDataList = [];

  countryListForAddress = [];
  provinceList = [];
  districtList = [];
  cityList;

  //*--For Business--//
  contactType;
  country;
  area;
  network;
  addressType = [];
  emailType;
  //*--For Partner--//
  pContactType;
  pCountry;
  pArea;
  pNetwork;
  pAddressType;
  pEmailType;
  //*--For Board of Directors--//
  bdContactType;
  bdCountry;
  bdArea;
  bdNetwork;
  bdAddressType;
  bdEmailType;
  //*--For Owner--//
  oContactType;
  oCountry;
  oArea;
  oNetwork;
  oAddressType;
  oEmailType;

  //*Variables for NgModels
  companyId = "";
  tblSearch;
  cmbCType = "";

  sCnic = "";
  sNtn = "";
  sOwnerName = "";
  sTelephoneNo = "";
  sMobileNo = "";
  sEmail = "";
  sAddress = "";
  soleContactType = "";
  soleCountryCode = "";
  soleAreaCode = "";
  soleMobileNetworkCode = "";
  soleContactNumber = "";

  pCnic = "";
  pNtn = "";
  pPartnerName = "";
  pPartnerRole = "";
  pDate = "";
  pShare = "";
  pTelephone = "";
  pMobile = "";
  pEmail = "";
  pAddress = "";
  partnerContactType = "";
  partnerCountryCode = "";
  partnerAreaCode = "";
  partnerMobileNetworkCode = "";
  partnerContactNumber = "";

  ppCnic = "";
  ppNtn = "";
  ppDirectorName = "";
  ppPosition = "";
  ppShare = "";
  ppTelephone = "";
  ppMobile = "";
  ppEmail = "";
  ppAddress = "";
  ppComContactType = "";
  ppComCountryCode = "";
  ppComAreaCode = "";
  ppComMobileNetworkCode = "";
  ppComContactNumber = "";

  bNtn = "";
  bStrn = "";
  bTitle = "";
  bNature = "";
  bDescription = "";
  bBusinessAddress = "";
  bMailingAddress = "";
  bTelephone = "";
  bMobile = "";
  bEmail = "";
  bWebsite = "";
  bFacebook = "";
  companyContactType = "";
  companyCountryCode = "";
  companyAreaCode = "";
  companyMobileNetworkCode = "";
  companyContactNumber = "";

  txtdPassword = "";
  txtdPin = "";
  dCompanyId = "";

  //*Boolean ng models and variables
  solePro = true;
  partner = false;
  ppCom = false;

  btnStpr1 = false;
  btnStpr2 = false;

  //* variables for pagination and orderby pipe
  p = 1;
  order = "info.name";
  reverse = false;
  sortedCollection: any[];
  itemPerPage = "10";

  //* Type combo box  (Business types)
  types = [
    { BusinessTypeCd: 1, BusinessTypeName: "Sole Proprietorship" },
    { BusinessTypeCd: 2, BusinessTypeName: "Partnership" },
    { BusinessTypeCd: 3, BusinessTypeName: "Public Company" },
  ];

  //*----------------For Owner Starts---------------//
  //contact Detail Owner
  oContactDetail = [
    {
      id: 0,
      contactType: "",
      countryCode: "",
      contactCode: "",
      areaCode: true,
      mobileCode: false,
      contactNumber: "",
      mobileNumber: "",
    },
  ];

  //address Detail Owner
  oAddressDetail = [
    {
      id: 0,
      addressType: "",
      address: "",
      countryCode: "",
      provinceCode: "",
      districtCode: "",
      cityCode: "",
    },
  ];

  //Emails Detail Owner
  oEmailDetail = [
    {
      id: 0,
      type: "",
      email: "",
    },
  ];

  //*----------------For Owner Ends---------------//

  //*----------------For Business Starts---------------//
  //contact Detail Business
  contactDetail = [
    {
      id: 0,
      contactType: "",
      countryCode: "",
      contactCode: "",
      areaCode: true,
      mobileCode: false,
      contactNumber: "",
      mobileNumber: "",
    },
  ];

  //address Detail Business
  addressDetail = [
    {
      id: 0,
      addressType: "",
      address: "",
      countryCode: "",
      provinceCode: "",
      districtCode: "",
      cityCode: "",
    },
  ];

  //addressDetail: Array[];

  //Emails Detail Business
  emailDetail = [
    {
      id: 0,
      type: "",
      email: "",
    },
  ];
  //*----------------For Business Ends---------------//

  companyDetail = [];
  compSumDetail = [];

  userDetail = [
    {
      companyId: 1,
      businessType: "Sole Proprietorship",
      title: "Title A",
      nature: "Private Sector",
      ntn: "345454",
      website: "www.Youtube.com",
    },
    {
      companyId: 2,
      businessType: "Partnership",
      title: "Title B",
      nature: "Public Sector",
      ntn: "1545453",
      website: "www.edx.com",
    },
    {
      companyId: 3,
      businessType: "Public Limited Company",
      title: "Title C",
      nature: "Private Sector",
      ntn: "67534653",
      website: "www.facebook.com",
    },
    {
      companyId: 4,
      businessType: "Private Limited Company",
      title: "Title D",
      nature: "Private Sector",
      ntn: "3535663",
      website: "www.udemy.com",
    },
    {
      companyId: 5,
      businessType: "Sole Proprietorship",
      title: "Title A",
      nature: "Private Sector",
      ntn: "34224",
      website: "www.Youtube.com",
    },
    {
      companyId: 6,
      businessType: "Partnership",
      title: "Title B",
      nature: "Public Sector",
      ntn: "155233",
      website: "www.edx.com",
    },
    {
      companyId: 7,
      businessType: "Public Limited Company",
      title: "Title C",
      nature: "Public Sector",
      ntn: "63543",
      website: "www.facebook.com",
    },
    {
      companyId: 8,
      businessType: "Private Limited Company",
      title: "Title D",
      nature: "Private Sector",
      ntn: "5654",
      website: "www.udemy.com",
    },
    {
      companyId: 9,
      businessType: "Sole Proprietorship",
      title: "Title A",
      nature: "Semi-Private Sector",
      ntn: "34444",
      website: "www.Youtube.com",
    },
    {
      companyId: 10,
      businessType: "Partnership",
      title: "Title B",
      nature: "Semi-Private Sector",
      ntn: "155334",
      website: "www.edx.com",
    },
    {
      companyId: 11,
      businessType: "Public Limited Company",
      title: "Title C",
      nature: "Public Sector",
      ntn: "677853",
      website: "www.facebook.com",
    },
    {
      companyId: 12,
      businessType: "Private Limited Company",
      title: "Title D",
      nature: "Semi-Private Sector",
      ntn: "36753",
      website: "www.udemy.com",
    },
  ];

  //* initializing array for partners detail
  partners: Partner[] = [];

  constructor(
    private toastr: ToastrManager,
    private app: AppComponent,
    private http: HttpClient,
    // private excelExportService: IgxExcelExporterService,
    // private csvExportService: IgxCsvExporterService,
    private fb: FormBuilder
  ) {
    this.contactType = [
      { label: "Fax", value: "1" },
      { label: "Telephone", value: "2" },
      { label: "Mobile", value: "3" },
    ];

    //Country Code for Mobiles
    this.country = [
      { label: "Pakistan +92", value: "+92" },
      { label: "Turkey +90", value: "+90" },
      { label: "US +1", value: "+1" },
    ];

    //Area Code
    this.area = [
      { label: 51, areaName: "Islamabad", value: "51" },
      { label: 21, areaName: "Karachi", value: "21" },
      { label: 42, areaName: "Lahore", value: "42" },
    ];

    //Mobile Code
    this.network = [
      { label: 300, networkName: "Jazz", value: "300" },
      { label: 313, networkName: "Zong", value: "313" },
      { label: 345, networkName: "Telenor", value: "345" },
      { label: 333, networkName: "Ufone", value: "333" },
    ];

    //Address Types
    // this.addressType = [
    //     { label: 'Current Address', value: '1' },
    //     { label: 'Office Address', value: '2' },
    //     { label: 'Postal Address', value: '3' }
    // ];

    //Email Types
    this.emailType = [
      { label: "Personal Email", value: "1" },
      { label: "Office Email", value: "2" },
    ];

    //* For partner ----------------------------------------//
    this.pContactType = [
      { label: "Fax", value: "1" },
      { label: "Telephone", value: "2" },
      { label: "Mobile", value: "3" },
    ];

    //Country Code
    this.pCountry = [
      { label: "Pakistan +92", value: "+92" },
      { label: "Turkey +90", value: "+90" },
      { label: "US +1", value: "+1" },
    ];

    //Area Code
    this.pArea = [
      { label: 51, areaName: "Islamabad", value: "51" },
      { label: 21, areaName: "Karachi", value: "21" },
      { label: 42, areaName: "Lahore", value: "42" },
    ];

    //Mobile Code
    this.pNetwork = [
      { label: 300, networkName: "Jazz", value: "300" },
      { label: 313, networkName: "Zong", value: "313" },
      { label: 345, networkName: "Telenor", value: "345" },
      { label: 333, networkName: "Ufone", value: "333" },
    ];

    //Address Types
    this.pAddressType = [
      { label: "Current Address", value: "1" },
      { label: "Office Address", value: "2" },
      { label: "Postal Address", value: "3" },
    ];

    //Email Types
    this.pEmailType = [
      { label: "Personal Email", value: "1" },
      { label: "Office Email", value: "2" },
    ];

    //* For BOD ----------------------------------------//
    this.bdContactType = [
      { label: "Fax", value: "1" },
      { label: "Telephone", value: "2" },
      { label: "Mobile", value: "3" },
    ];

    //Country Code
    this.bdCountry = [
      { label: "Pakistan +92", value: "+92" },
      { label: "Turkey +90", value: "+90" },
      { label: "US +1", value: "+1" },
    ];

    //Area Code
    this.bdArea = [
      { label: 51, areaName: "Islamabad", value: "51" },
      { label: 21, areaName: "Karachi", value: "21" },
      { label: 42, areaName: "Lahore", value: "42" },
    ];

    //Mobile Code
    this.bdNetwork = [
      { label: 300, networkName: "Jazz", value: "300" },
      { label: 313, networkName: "Zong", value: "313" },
      { label: 345, networkName: "Telenor", value: "345" },
      { label: 333, networkName: "Ufone", value: "333" },
    ];

    //Address Types
    this.bdAddressType = [
      { label: "Current Address", value: "1" },
      { label: "Office Address", value: "2" },
      { label: "Postal Address", value: "3" },
    ];

    //Email Types
    this.bdEmailType = [
      { label: "Personal Email", value: "1" },
      { label: "Office Email", value: "22" },
    ];

    //* For Owner ----------------------------------------//
    this.oContactType = [
      { label: "Fax", value: "1" },
      { label: "Telephone", value: "2" },
      { label: "Mobile", value: "3" },
    ];

    //Country Code
    this.oCountry = [
      { label: "Pakistan +92", value: "+92" },
      { label: "Turkey +90", value: "+90" },
      { label: "US +1", value: "+1" },
    ];

    //Area Code
    this.oArea = [
      { label: 51, areaName: "Islamabad", value: "51" },
      { label: 21, areaName: "Karachi", value: "21" },
      { label: 42, areaName: "Lahore", value: "42" },
    ];

    //Mobile Code
    this.oNetwork = [
      { label: 300, networkName: "Jazz", value: "300" },
      { label: 313, networkName: "Zong", value: "313" },
      { label: 345, networkName: "Telenor", value: "345" },
      { label: 333, networkName: "Ufone", value: "333" },
    ];

    //Address Types
    this.oAddressType = [
      { label: "Current Address", value: "1" },
      { label: "Office Address", value: "2" },
      { label: "Postal Address", value: "3" },
    ];

    //Email Types
    this.oEmailType = [
      { label: "Personal Email", value: "1" },
      { label: "Office Email", value: "2" },
    ];
  }

  ngOnInit() {
    //*countrys list for address
    // this.countryListForAddress = [
    //     { label: "Pakistan +92", value: "+92" },
    //     { label: "Turkey +90", value: "+90" },
    //     { label: "US +1", value: "+1" }
    // ];

    //*province List
    // this.provinceList = [
    //     { label: "Balochistan", value: "7" },
    //     { label: "Khyber Pakhtunkhwa", value: "2" },
    //     { label: "Punjab", value: "6" },
    //     { label: "Sindh", value: "8" }
    // ];

    //*district List
    // this.districtList = [
    //     { label: "Rawalpindi", value: "1" },
    //     { label: "Lahore", value: "2" },
    //     { label: "Peshawar", value: "3" },
    //     { label: "Karachi", value: "4" },
    //     { label: "Hyderabad", value: "5" },
    //     { label: "Quetta", value: "6" }
    // ];

    //*city List
    this.cityList = [
      { label: "Rawalpindi", value: "1" },
      { label: "Gujerkhan", value: "2" },
      { label: "Kahuta", value: "6" },
      { label: "Karachi", value: "8" },
      { label: "Lahore", value: "8" },
      { label: "Quetta", value: "8" },
      { label: "Peshawar", value: "8" },
      { label: "Merdan", value: "8" },
      { label: "Noshera", value: "8" },
    ];

    this.getCompany();
    this.getAddressType();
    this.getCountry();
    this.getProvince();
    this.getDistrict();
  }

  // // @ViewChild("excelDataContent") public excelDataContent: IgxGridComponent; //For excel
  @ViewChild("exportPDF") public exportPDF: ElementRef; //for pdf

  getAddressType() {
    //return false;

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getAddressType", { headers: reqHeader })
      .subscribe((data: any) => {
        //this.addressType = data
        //alert(data.length);
        for (var i = 0; i < data.length; i++) {
          this.addressType.push({
            label: data[i].addressTypeName,
            value: data[i].addressTypeCd,
          });
        }
        //alert(this.addressType)
      });
  }

  getCountry() {
    //return false;

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getCountry", { headers: reqHeader })
      .subscribe((data: any) => {
        //this.addressType = data
        //alert(data.length);
        for (var i = 0; i < data.length; i++) {
          this.countryListForAddress.push({
            label: data[i].cntryName,
            value: data[i].cntryCd,
          });
        }
        //alert(this.addressType)
      });
  }

  getCompany() {
    //return false;

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getCompanySummary", { headers: reqHeader })
      .subscribe((data: any) => {
        //this.addressType = data
        //alert(data.length);
        this.compSumDetail = data;
        for (var i = 0; i < data.length; i++) {
          if (this.companyDetail.length == 0) {
            this.companyDetail.push({
              cmpnyCd: data[i].cmpnyID,
              businessTypeCd: data[i].businessTypeCd,
              businessType: data[i].businessTypeName,
              title: data[i].orgName,
              //nature: data[i].n,
              ntn: data[i].orgNTN,
              website: data[i].orgWebsite,
            });
          } else {
            for (var j = 0; j < this.companyDetail.length; j++) {
              if (this.companyDetail[j].cmpnyCd != data[i].cmpnyID) {
                this.companyDetail.push({
                  cmpnyCd: data[i].cmpnyID,
                  businessType: data[i].businessTypeName,
                  title: data[i].orgName,
                  //nature: data[i].n,
                  ntn: data[i].orgNTN,
                  website: data[i].orgWebsite,
                });
              }
            }
          }
        }
        //alert(this.addressType)
      });
  }

  getProvince() {
    //return false;

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getProvince", { headers: reqHeader })
      .subscribe((data: any) => {
        //this.addressType = data
        //alert(data.length);
        for (var i = 0; i < data.length; i++) {
          this.provinceList.push({
            label: data[i].prvinceName,
            value: data[i].prvncCd,
          });
        }
        //alert(this.addressType)
      });
  }

  getDistrict() {
    //return false;

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getDistrict", { headers: reqHeader })
      .subscribe((data: any) => {
        //this.addressType = data
        //alert(data.length);
        for (var i = 0; i < data.length; i++) {
          this.districtList.push({
            label: data[i].districtName,
            value: data[i].districtCd,
          });
        }
        //alert(this.addressType)
      });
  }

  //* Function for save and update company
  save() {
    if (this.cmbCType == "") {
      this.toastr.errorToastr("Please select business type", "Error", {
        toastTimeout: 2500,
      });
      return false;
    }

    //*----- For Business ------//
    else if (this.bNtn == "" || this.bNtn.length < 8) {
      this.toastr.errorToastr("Please enter business ntn", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.bStrn == "" || this.bStrn.length < 10) {
      this.toastr.errorToastr("Please enter business strn", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.bTitle == "") {
      this.toastr.errorToastr("Please enter business title", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.bNature == "") {
      this.toastr.errorToastr("Please enter business nature", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.bDescription == "") {
      this.toastr.errorToastr("Please enter business description", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.bWebsite == "") {
      this.toastr.errorToastr("Please enter business website", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.bFacebook == "") {
      this.toastr.errorToastr("Please enter facebook link", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.addressDetail.length == 0) {
      this.toastr.errorToastr("Please Add Business Address Info", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.contactDetail.length == 0) {
      this.toastr.errorToastr(
        "Please Add Business Contact Info Type",
        "Error",
        { toastTimeout: 2500 }
      );
      return false;
    } else if (this.emailDetail.length == 0) {
      this.toastr.errorToastr("Please Add Business Email Info", "Error", {
        toastTimeout: 2500,
      });
      return false;
    }

    //*----- For Owner ------//
    else if (
      this.solePro == true &&
      (this.sCnic == "" || this.sCnic.length < 13)
    ) {
      this.toastr.errorToastr("Please enter owner CNIC", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (
      this.solePro == true &&
      (this.sNtn == "" || this.sNtn.length < 8)
    ) {
      this.toastr.errorToastr("Please enter owner NTN", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.solePro == true && this.sOwnerName == "") {
      this.toastr.errorToastr("Please enter owner name", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.solePro == true && this.oAddressDetail.length == 0) {
      this.toastr.errorToastr("Please Add Owner Address Info", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.solePro == true && this.oContactDetail.length == 0) {
      this.toastr.errorToastr("Please Add Owner Contact Info Type", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.solePro == true && this.oEmailDetail.length == 0) {
      this.toastr.errorToastr("Please Add Owner Email Info", "Error", {
        toastTimeout: 2500,
      });
      return false;
    }
    //*----- For Partner ------//
    else if (
      this.partner == true &&
      (this.partners.length == undefined || this.partners.length < 1)
    ) {
      this.toastr.errorToastr("Please enter partner information", "Error", {
        toastTimeout: 2500,
      });
      return false;
    }
    //*----- For Board of Directors ------//
    else if (
      this.ppCom == true &&
      (this.ppCnic == "" || this.ppCnic.length < 13)
    ) {
      this.toastr.errorToastr("Please enter director cnic", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (
      this.ppCom == true &&
      (this.ppNtn == "" || this.ppNtn.length < 8)
    ) {
      this.toastr.errorToastr("Please enter director ntn", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ppCom == true && this.ppDirectorName == "") {
      this.toastr.errorToastr("Please enter director name", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ppCom == true && this.ppPosition == "") {
      this.toastr.errorToastr("Please enter director position", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ppCom == true && this.ppShare == "") {
      this.toastr.errorToastr("Please enter director share", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ppCom == true && this.oAddressDetail.length == 0) {
      this.toastr.errorToastr("Please Add BOD Address Info", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ppCom == true && this.oContactDetail.length == 0) {
      this.toastr.errorToastr("Please Add BOD Contact Info", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ppCom == true && this.oEmailDetail.length == 0) {
      this.toastr.errorToastr("Please Add BOD Email Info", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      //* For Business Info ****************************************************************

      // // address type conditions
      if (this.addressDetail.length > 0) {
        for (let i = 0; i < this.addressDetail.length; i++) {
          if (this.addressDetail[i].addressType.trim() == "") {
            this.toastr.errorToastr(
              "Please enter complete business address detail",
              "Error",
              { toastTimeout: 2500 }
            );
            return false;
          } else if (this.addressDetail[i].address.trim() == "") {
            this.toastr.errorToastr(
              "Please enter complete business address detail",
              "Error",
              { toastTimeout: 2500 }
            );
            return false;
          } else if (this.addressDetail[i].countryCode == "") {
            this.toastr.errorToastr(
              "Please enter complete business address detail",
              "Error",
              { toastTimeout: 2500 }
            );
            return false;
          } else if (this.addressDetail[i].provinceCode == "") {
            this.toastr.errorToastr(
              "Please enter complete business address detail",
              "Error",
              { toastTimeout: 2500 }
            );
            return false;
          } else if (this.addressDetail[i].districtCode == "") {
            this.toastr.errorToastr(
              "Please enter complete business address detail",
              "Error",
              { toastTimeout: 2500 }
            );
            return false;
          } else if (this.addressDetail[i].cityCode == "") {
            this.toastr.errorToastr(
              "Please enter complete business address detail",
              "Error",
              { toastTimeout: 2500 }
            );
            return false;
          }
        }
      }

      // contact type conditions
      if (this.contactDetail.length > 0) {
        for (let i = 0; i < this.contactDetail.length; i++) {
          if (this.contactDetail[i].contactType.trim() == "") {
            this.toastr.errorToastr(
              "Please enter complete business contact detail",
              "Error",
              { toastTimeout: 2500 }
            );
            return false;
          } else if (this.contactDetail[i].countryCode.trim() == "") {
            this.toastr.errorToastr(
              "Please enter complete business contact detail",
              "Error",
              { toastTimeout: 2500 }
            );
            return false;
          } else if (
            this.contactDetail[i].areaCode == true &&
            this.contactDetail[i].contactNumber.trim() == ""
          ) {
            this.toastr.errorToastr(
              "Please enter complete business contact detail",
              "Error",
              { toastTimeout: 2500 }
            );
            return false;
          } else if (
            this.contactDetail[i].mobileCode == true &&
            this.contactDetail[i].mobileNumber.trim() == ""
          ) {
            this.toastr.errorToastr(
              "Please enter complete business contact detail",
              "Error",
              { toastTimeout: 2500 }
            );
            return false;
          }
        }
      }

      // email type conditions
      if (this.emailDetail.length > 0) {
        for (let i = 0; i < this.emailDetail.length; i++) {
          if (this.emailDetail[i].type.trim() == "") {
            this.toastr.errorToastr(
              "Please Select Business Email Type",
              "Error",
              { toastTimeout: 2500 }
            );
            return false;
          } else if (this.emailDetail[i].email.trim() == "") {
            this.toastr.errorToastr("Please Enter Business Email", "Error", {
              toastTimeout: 2500,
            });
            return false;
          } else if (this.isEmail(this.emailDetail[i].email.trim()) == false) {
            this.toastr.errorToastr("Invalid Business email", "Error", {
              toastTimeout: 2500,
            });
            return false;
          }
        }
      }

      // // address type conditions
      if (this.oAddressDetail.length > 0) {
        for (let i = 0; i < this.oAddressDetail.length; i++) {
          if (this.oAddressDetail[i].addressType.trim() == "") {
            this.toastr.errorToastr(
              "Please enter complete owner address detail",
              "Error",
              { toastTimeout: 2500 }
            );
            return false;
          } else if (this.oAddressDetail[i].address.trim() == "") {
            this.toastr.errorToastr(
              "Please enter complete owner address detail",
              "Error",
              { toastTimeout: 2500 }
            );
            return false;
          } else if (this.oAddressDetail[i].countryCode == "") {
            this.toastr.errorToastr(
              "Please enter complete owner address detail",
              "Error",
              { toastTimeout: 2500 }
            );
            return false;
          } else if (this.oAddressDetail[i].provinceCode == "") {
            this.toastr.errorToastr(
              "Please enter complete owner address detail",
              "Error",
              { toastTimeout: 2500 }
            );
            return false;
          } else if (this.oAddressDetail[i].districtCode == "") {
            this.toastr.errorToastr(
              "Please enter complete owner address detail",
              "Error",
              { toastTimeout: 2500 }
            );
            return false;
          } else if (this.oAddressDetail[i].cityCode == "") {
            this.toastr.errorToastr(
              "Please enter complete owner address detail",
              "Error",
              { toastTimeout: 2500 }
            );
            return false;
          }
        }
      }
      // // contact type conditions
      if (this.oContactDetail.length > 0) {
        for (let i = 0; i < this.oContactDetail.length; i++) {
          if (this.oContactDetail[i].contactType.trim() == "") {
            this.toastr.errorToastr(
              "Please enter complete contact detail",
              "Error",
              { toastTimeout: 2500 }
            );
            return false;
          } else if (this.oContactDetail[i].countryCode.trim() == "") {
            this.toastr.errorToastr(
              "Please enter complete contact detail",
              "Error",
              { toastTimeout: 2500 }
            );
            return false;
          } else if (
            this.oContactDetail[i].areaCode == true &&
            this.oContactDetail[i].contactNumber.trim() == ""
          ) {
            this.toastr.errorToastr(
              "Please enter complete contact detail",
              "Error",
              { toastTimeout: 2500 }
            );
            return false;
          } else if (
            this.oContactDetail[i].mobileCode == true &&
            this.oContactDetail[i].mobileNumber.trim() == ""
          ) {
            this.toastr.errorToastr(
              "Please enter complete contact detail",
              "Error",
              { toastTimeout: 2500 }
            );
            return false;
          }
        }
      }
      // // email type conditions
      if (this.oEmailDetail.length > 0) {
        for (let i = 0; i < this.oEmailDetail.length; i++) {
          if (this.oEmailDetail[i].type.trim() == "") {
            this.toastr.errorToastr(
              "Please enter complete owner email detail",
              "Error",
              { toastTimeout: 2500 }
            );
            return false;
          } else if (this.oEmailDetail[i].email.trim() == "") {
            this.toastr.errorToastr(
              "Please enter complete owner email detail",
              "Error",
              { toastTimeout: 2500 }
            );
            return false;
          } else if (this.isEmail(this.oEmailDetail[i].email.trim()) == false) {
            this.toastr.errorToastr("Invalid Owner email detail", "Error", {
              toastTimeout: 2500,
            });
            return false;
          }
        }
      }

      //--------------------------------------------//

      if (this.cmbCType == "1") {
        this.partners = [];
        this.clearPartner();

        this.partners.push({
          pId: this.partners.length + 1,
          cnic: this.sCnic,
          ntn: this.sNtn,
          name: this.sOwnerName,
          role: null,
          date: null,
          share: null,
          position: null,
        });
      } else if (this.cmbCType == "3") {
        this.partners = [];
        this.clearPartner();

        this.partners.push({
          pId: this.partners.length + 1,
          cnic: this.ppCnic,
          ntn: this.ppNtn,
          name: this.ppDirectorName,
          role: null,
          date: null,
          share: this.ppShare,
          position: this.ppPosition,
        });
      }

      if (this.companyId != "") {
        this.app.showSpinner();
        this.toastr.successToastr("update successfully", "Success", {
          toastTimeout: 2500,
        });
        //this.clear(this.companyId);
        this.clear(1);
        // this.clearPartner();
        // this.clearBoardDirectors();
        // this.clearOwner();
        $("#companyModal").modal("hide");
        this.app.hideSpinner();
        return false;

        var updateData = { Password: this.txtdPassword, PIN: this.txtdPin };

        var token = localStorage.getItem(this.tokenKey);

        var reqHeader = new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        });

        this.http
          .put(this.serverUrl + "api/pwCreate", updateData, {
            headers: reqHeader,
          })
          .subscribe((data: any) => {
            if (data.msg != undefined) {
              this.toastr.errorToastr(data.msg, "Error!", {
                toastTimeout: 2500,
              });
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

        // this.toastr.successToastr('validation complete information', 'Success!', { toastTimeout: (2500) });
        // return false;
      } else {
        this.app.showSpinner();

        //$('#companyModal').modal('hide');
        //this.app.hideSpinner();
        //return false;

        var saveData = {
          companyTitle: this.bTitle,
          businessType: Number(this.cmbCType),
          companyNtn: this.bNtn,
          companyStrn: this.bStrn,
          companyNature: this.bNature,
          companyDesc: this.bDescription,
          website: this.bWebsite,
          fbId: this.bFacebook,
          address: JSON.stringify(this.addressDetail),
          telephone: JSON.stringify(this.contactDetail),
          email: JSON.stringify(this.emailDetail),
          partners: JSON.stringify(this.partners),
          pAddress: JSON.stringify(this.oAddressDetail),
          pTelephone: JSON.stringify(this.oContactDetail),
          pEmail: JSON.stringify(this.oEmailDetail),
        };

        //alert(saveData.companyStrn);

        // var token = localStorage.getItem(this.tokenKey);

        // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

        // this.http.post(this.serverUrl + 'api/saveCompany', saveData, { headers: reqHeader }).subscribe((data: any) => {
        this.http
          .post(this.serverUrl + "api/saveCompany", saveData, {
            headers: reqHeader,
          })
          .subscribe((data: any) => {
            if (data.msg != undefined) {
              this.toastr.successToastr(data.msg, "Success!", {
                toastTimeout: 2500,
              });
              this.getCompany();
              $("#companyModal").modal("hide");
              this.app.hideSpinner();
              return false;
            } else {
              this.toastr.errorToastr(data.msg, "Error!", {
                toastTimeout: 2500,
              });
              //$('#companyModal').modal('hide');
              this.app.hideSpinner();
              return false;
            }
          });
      }
    }
  }

  //* Function for add new partner for company
  addPartner() {
    //return false;
    if (this.pCnic == "" || this.pCnic.length < 13) {
      this.toastr.errorToastr("Please enter partner CNIC", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.pNtn == "" || this.pNtn.length < 8) {
      this.toastr.errorToastr("Please enter partner NTN", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.pPartnerName == "") {
      this.toastr.errorToastr("Please enter partner name", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.pPartnerRole == "") {
      this.toastr.errorToastr("Please enter partner role", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.pDate == "") {
      this.toastr.errorToastr("Please enter partner date", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.pShare == "") {
      this.toastr.errorToastr("Please enter partner share", "Error", {
        toastTimeout: 2500,
      });
      return false;
    }
    // address type conditions
    else if (this.oAddressDetail.length == 0) {
      this.toastr.errorToastr("Please Add Partner Address Info", "Error", {
        toastTimeout: 2500,
      });
      return false;
    }
    // contact type conditions
    else if (this.oContactDetail.length == 0) {
      this.toastr.errorToastr("Please Add Partner Contact Info Type", "Error", {
        toastTimeout: 2500,
      });
      return false;
    }
    // email type conditions
    else if (this.oEmailDetail.length == 0) {
      this.toastr.errorToastr("Please Add Partner Email Info", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      let data = this.partners.find((x) => x.cnic == this.pCnic);

      if (data != undefined) {
        this.toastr.errorToastr("Partner already exist", "Error", {
          toastTimeout: 2500,
        });
        return false;
      } else {
        this.partners.push({
          pId: this.partners.length + 1,
          cnic: this.pCnic,
          ntn: this.pNtn,
          name: this.pPartnerName,
          role: this.pPartnerRole,
          date: new Date(this.pDate),
          share: this.pShare,
          position: null,
        });

        this.clearPartner();
        this.clearOwner();
      }
    }
  }

  //* Function for empty all fields of partner information
  clearPartner() {
    this.pCnic = "";
    this.pNtn = "";
    this.pPartnerName = "";
    this.pPartnerRole = "";
    this.pDate = "";
    this.pShare = "";
  }

  //* Function for empty all fields of Owner information
  clearOwner() {
    if (this.partner == false) {
      //contact Detail Owner
      this.oContactDetail = [
        {
          contactType: "",
          countryCode: "",
          contactCode: "",
          areaCode: true,
          mobileCode: false,
          contactNumber: "",
          mobileNumber: "",
          id: 0,
        },
      ];

      //address Detail Owner
      this.oAddressDetail = [
        {
          addressType: "",
          address: "",
          countryCode: "",
          provinceCode: "",
          districtCode: "",
          cityCode: "",
          id: 0,
        },
      ];

      //Emails Detail Owner
      this.oEmailDetail = [
        {
          type: "",
          email: "",
          id: 0,
        },
      ];
    } else {
      //contact Detail Owner
      this.oContactDetail = [
        {
          contactType: "",
          countryCode: "",
          contactCode: "",
          areaCode: true,
          mobileCode: false,
          contactNumber: "",
          mobileNumber: "",
          id: this.partners.length,
        },
      ];

      //address Detail Owner
      this.oAddressDetail = [
        {
          addressType: "",
          address: "",
          countryCode: "",
          provinceCode: "",
          districtCode: "",
          cityCode: "",
          id: this.partners.length,
        },
      ];

      //Emails Detail Owner
      this.oEmailDetail = [
        {
          type: "",
          email: "",
          id: this.partners.length,
        },
      ];
    }
  }

  //function for empty all fields
  clear(cId) {
    if (cId > 0) {
      this.ppCom = false;
      this.partner = false;
      this.solePro = false;

      this.btnStpr1 = false;
      this.btnStpr2 = false;
      this.cmbCType = "";

      this.sCnic = "";
      this.sNtn = "";
      this.sOwnerName = "";
      //this.sTelephoneNo = '';
      //this.sMobileNo = '';
      //this.sEmail = '';
      //this.sAddress = '';

      this.clearPartner();
      this.clearOwner();

      this.ppCnic = "";
      this.ppNtn = "";
      this.ppDirectorName = "";
      this.ppPosition = "";
      this.ppShare = "";
      // this.ppTelephone = '';
      // this.ppMobile = '';
      // this.ppEmail = '';
      // this.ppAddress = '';

      this.bNtn = "";
      this.bStrn = "";
      this.bTitle = "";
      this.bNature = "";
      this.bDescription = "";
      // this.bBusinessAddress = '';
      // this.bMailingAddress = '';
      // this.bTelephone = '';
      // this.bMobile = '';
      // this.bEmail = '';
      this.bWebsite = "";
      this.bFacebook = "";

      // this.contactFormSole.reset();
      // this.contactFormPPCom.reset();
      // this.contactFormCompany.reset();

      this.txtdPassword = "";
      this.txtdPin = "";
      this.dCompanyId = "";

      this.addressDetail = [
        {
          id: 0,
          addressType: "",
          address: "",
          countryCode: "",
          provinceCode: "",
          districtCode: "",
          cityCode: "",
        },
      ];

      this.contactDetail = [
        {
          id: 0,
          contactType: "",
          countryCode: "countryCode",
          contactCode: "",
          areaCode: true,
          mobileCode: false,
          contactNumber: "",
          mobileNumber: "",
        },
      ];

      this.emailDetail = [
        {
          id: 0,
          type: "",
          email: "",
        },
      ];
    }
  }

  //function for edit existing currency
  edit(item) {
    this.companyId = item.cmpnyCd;
    this.cmbCType = item.businessTypeCd;

    this.allowDiv();
  }

  //functions for delete company
  deleteTemp(item) {
    //this.clear(item.companyId);
    this.dCompanyId = item.cmpnyCd;
    //alert(this.dCompanyId)
  }

  delete() {
    if (this.txtdPassword == "") {
      this.toastr.errorToastr("Please enter password", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtdPin == "") {
      this.toastr.errorToastr("Please enter PIN", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.dCompanyId == "") {
      this.toastr.errorToastr("Invalid delete request", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      this.app.showSpinner();

      //this.toastr.successToastr('Deleted successfully', 'Error', { toastTimeout: (2500) });

      //return false;

      //var token = localStorage.getItem(this.tokenKey);

      //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
      //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

      this.http
        .delete(
          this.serverUrl +
            "api/deleteCompany?companyId=" +
            this.dCompanyId +
            "&password=" +
            this.txtdPassword +
            "&pin=" +
            this.txtdPin
        )
        .subscribe((data: any) => {
          if (data.msg != undefined) {
            this.toastr.successToastr(data.msg, "Success!", {
              toastTimeout: 2500,
            });
            this.getCompany();
            $("#closeDeleteModel").modal("hide");
            this.clear(1);
            this.app.hideSpinner();
            return false;
          } else {
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 2500 });
            //$('#companyModal').modal('hide');
            this.app.hideSpinner();
            return false;
          }
        });
    }
  }

  //Function for remote partner from list
  remove(item) {
    var index = this.partners.indexOf(item);
    this.partners.splice(index, 1);
  }

  //Function for validate email address
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

  // //For CSV File
  // public downloadCSV() {
  //   // case 1: When tblSearch is empty then assign full data list
  //   if (this.tblSearch == "") {
  //     var completeDataList = [];
  //     for (var i = 0; i < this.userDetail.length; i++) {
  //       completeDataList.push({
  //         businessType: this.userDetail[i].businessType,
  //         title: this.userDetail[i].title,
  //         nature: this.userDetail[i].nature,
  //         ntn: this.userDetail[i].ntn,
  //         website: this.userDetail[i].website
  //       });
  //     }
  //     this.csvExportService.exportData(
  //       completeDataList,
  //       new IgxCsvExporterOptions("CompanyCompleteCSV", CsvFileTypes.CSV)
  //     );
  //   }
  //   // case 2: When tblSearch is not empty then assign new data list
  //   else if (this.tblSearch != "") {
  //     var filteredDataList = [];
  //     for (var i = 0; i < this.userDetail.length; i++) {
  //       if (
  //         this.userDetail[i].businessType
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase()) ||
  //         this.userDetail[i].title
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase()) ||
  //         this.userDetail[i].nature
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase()) ||
  //         this.userDetail[i].ntn
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase()) ||
  //         this.userDetail[i].website
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase())
  //       ) {
  //         filteredDataList.push({
  //           businessType: this.userDetail[i].businessType,
  //           title: this.userDetail[i].title,
  //           nature: this.userDetail[i].nature,
  //           ntn: this.userDetail[i].ntn,
  //           website: this.userDetail[i].website
  //         });
  //       }
  //     }
  //     if (filteredDataList.length > 0) {
  //       this.csvExportService.exportData(
  //         filteredDataList,
  //         new IgxCsvExporterOptions("CompanyFilterCSV", CsvFileTypes.CSV)
  //       );
  //     } else {
  //       this.toastr.errorToastr("Oops! No data found", "Error", {
  //         toastTimeout: 2500
  //       });
  //     }
  //   }
  // }

  // //For Exce File
  // public downloadExcel() {
  //   // case 1: When tblSearch is empty then assign full data list
  //   if (this.tblSearch == "") {
  //     //var completeDataList = [];
  //     for (var i = 0; i < this.userDetail.length; i++) {
  //       this.excelDataList.push({
  //         businessType: this.userDetail[i].businessType,
  //         title: this.userDetail[i].title,
  //         nature: this.userDetail[i].nature,
  //         ntn: this.userDetail[i].ntn,
  //         website: this.userDetail[i].website
  //       });
  //     }
  //     this.excelExportService.export(
  //       this.excelDataContent,
  //       new IgxExcelExporterOptions("CompanyCompleteExcel")
  //     );
  //     this.excelDataList = [];
  //   }
  //   // case 2: When tblSearch is not empty then assign new data list
  //   else if (this.tblSearch != "") {
  //     for (var i = 0; i < this.userDetail.length; i++) {
  //       if (
  //         this.userDetail[i].businessType
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase()) ||
  //         this.userDetail[i].title
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase()) ||
  //         this.userDetail[i].nature
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase()) ||
  //         this.userDetail[i].ntn
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase()) ||
  //         this.userDetail[i].website
  //           .toUpperCase()
  //           .includes(this.tblSearch.toUpperCase())
  //       ) {
  //         this.excelDataList.push({
  //           businessType: this.userDetail[i].businessType,
  //           title: this.userDetail[i].title,
  //           nature: this.userDetail[i].nature,
  //           ntn: this.userDetail[i].ntn,
  //           website: this.userDetail[i].website
  //         });
  //       }
  //     }
  //     if (this.excelDataList.length > 0) {
  //       this.excelExportService.export(
  //         this.excelDataContent,
  //         new IgxExcelExporterOptions("CompanyFilterExcel")
  //       );
  //       this.excelDataList = [];
  //     } else {
  //       this.toastr.errorToastr("Oops! No data found", "Error", {
  //         toastTimeout: 2500
  //       });
  //     }
  //   }
  // }

  //* function for hide or unhide div
  allowDiv() {
    //alert(this.cmbCType);

    if (this.cmbCType == "") {
      this.toastr.errorToastr("Please select business type", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.cmbCType == "1") {
      this.solePro = true;
      this.partner = false;
      this.ppCom = false;
    } else if (this.cmbCType == "2") {
      this.partner = true;
      this.solePro = false;
      this.ppCom = false;
    } else if (this.cmbCType == "3") {
      this.ppCom = true;
      this.partner = false;
      this.solePro = false;
    }

    if (this.cmbCType != "") {
      this.btnStpr1 = true;
    }
  }

  //*----------------For Owner Starts---------------//
  owOnContactChange(oContactType, item) {
    if (oContactType == "Fax") {
      item.areaCode = true;
      item.mobileCode = false;
    } else if (oContactType == "Telephone") {
      item.areaCode = true;
      item.mobileCode = false;
    } else if (oContactType == "Mobile") {
      item.areaCode = false;
      item.mobileCode = true;
    } else {
      return;
    }
  }

  oAddContact() {
    if (this.partner == false) {
      this.oContactDetail.push({
        contactType: "",
        countryCode: "",
        contactCode: "",
        areaCode: true,
        mobileCode: false,
        contactNumber: "",
        mobileNumber: "",
        id: 0,
      });
    } else {
      this.oContactDetail.push({
        contactType: "",
        countryCode: "",
        contactCode: "",
        areaCode: true,
        mobileCode: false,
        contactNumber: "",
        mobileNumber: "",
        id: this.partners.length,
      });
    }
  }

  oAddAddress() {
    if (this.partner == false) {
      this.oAddressDetail.push({
        addressType: "",
        address: "",
        countryCode: "",
        provinceCode: "",
        districtCode: "",
        cityCode: "",
        id: 0,
      });
    } else {
      this.oAddressDetail.push({
        addressType: "",
        address: "",
        countryCode: "",
        provinceCode: "",
        districtCode: "",
        cityCode: "",
        id: this.partners.length,
      });
    }
  }

  oAddEmail() {
    if (this.partner == false) {
      this.oEmailDetail.push({
        type: "",
        email: "",
        id: 0,
      });
    } else {
      this.oEmailDetail.push({
        type: "",
        email: "",
        id: this.partners.length,
      });
    }
  }

  //Deleting contact row
  oRemoveContact(item) {
    if (this.partner == false) {
      this.oContactDetail.splice(item, 1);
    } else {
      // this.oContactDetail.splice(item, 1);
      // this.oEmailDetail.push({
      //     type: "",
      //     email: "",
      //     id: this.partners.length
      // });
    }
  }

  //Deleting address row
  oRemoveAddress(item) {
    this.oAddressDetail.splice(item, 1);
  }

  //Deleting address row
  oRemoveEmail(item) {
    this.oEmailDetail.splice(item, 1);
  }

  //*----------------For Owner Ends---------------//

  //*----------------For Business Starts---------------//
  onContactChange(contactType, item) {
    if (contactType == "Fax") {
      item.areaCode = true;
      item.mobileCode = false;
    } else if (contactType == "Telephone") {
      item.areaCode = true;
      item.mobileCode = false;
    } else if (contactType == "Mobile") {
      item.areaCode = false;
      item.mobileCode = true;
    } else {
      return;
    }
  }

  addContact() {
    this.contactDetail.push({
      id: 0,
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
    this.addressDetail.push({
      id: 0,
      addressType: "",
      address: "",
      countryCode: "",
      provinceCode: "",
      districtCode: "",
      cityCode: "",
    });
  }

  addEmail() {
    this.emailDetail.push({
      id: 0,
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

  //*----------------For Business Ends---------------//
}
