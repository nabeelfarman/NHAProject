import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef
} from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError, filter } from "rxjs/operators";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ToastrManager } from "ng6-toastr-notifications";
import { AppComponent } from "../../../../../../src/app/app.component";
import { CurrencyComponent } from "../currency/currency.component";
import { Router } from "@angular/router";

import { ConfigAddressComponent } from "src/app/components/config-address/config-address.component";
//import { ConfigSocialMediaComponent } from 'src/app/components/config-social-media/config-social-media.component';

// import * as jsPDF from 'jspdf';
// import {
//   IgxExcelExporterOptions,
//   IgxExcelExporterService,
//   IgxGridComponent,
//   IgxCsvExporterService,
//   IgxCsvExporterOptions,
//   CsvFileTypes
// } from "igniteui-angular";
// import { jsonpCallbackContext } from "@angular/common/http/src/module";
import { parse } from "querystring";

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

@Component({
  selector: "app-company",
  templateUrl: "./company.component.html",
  styleUrls: ["./company.component.scss"]
})
export class CompanyComponent implements OnInit {
  // public contactFormSole: FormGroup;
  // public contactFormPartner: FormGroup;
  // public contactFormPPCom: FormGroup;
  // public contactFormCompany: FormGroup;

  // areaCode = false;
  // mobileNetworkCode = false;
  // soleBox = true;
  // partnerBox = true;
  // ppComBox = true;

  @ViewChild(ConfigAddressComponent) child: ConfigAddressComponent;

  companyBox = true;

  serverUrl = "http://ambit-erp.southeastasia.cloudapp.azure.com:9043/";
  //imgPath = "C:/inetpub/wwwroot/EMIS/assets/images/EmpImages";

  // serverUrl = "http://localhost:9043/";
  //   imgPath =
  //     "I:/VU Projects/Visual_Code_Proj/ERP_Module/HaroonE/src/assets/images/CmpnyImages";
  imgPath = "C:/inetpub/wwwroot/EMIS/assets/images/EmpImages";

  tokenKey = "token";

  imageUrl: string = "../assets/images/EmpImages/uploadlogo.jpg";

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

  // list variables -----------
  excelDataList = [];

  countryListForAddress = [];

  cmpnyList = [];
  cmpnyDetailList = [];
  stakeHolderList = [];

  cntryList = [];
  cityList = [];
  cntctTypeList = [];
  crncyList = [];
  businessTypeList = [];

  companyEditMode = false;

  //*--For Business--//
  contactType;
  country;
  area;
  network;
  addressType = [];
  emailType;

  //Variables for NgModels
  srchCntry;
  srchCity;
  srchCrncy;
  tblSearch;
  companyId = "";
  cmbCType = "";
  companyName = "";
  cNtn = "";
  cStrn = "";
  cBusinessType = "";
  cEmployeQty = "";
  cCurrency = "";
  cLogo = "";

  cAddressType = "";
  cAddress = "";
  cCountry = "";
  cCity = "";
  cZipCode = "";

  cContactType = "";
  cContactNumber = "";
  cEmailAdrs = "";

  //owner variable for ngModels
  oName = "";
  oCNIC = "";

  //partner variable for ngModels
  pType = "";
  pShare = "";
  pName = "";
  pCNIC = "";

  //director variable for ngModels
  dTitle = "";
  dShare = "";
  dName = "";
  dCNIC = "";

  //indvidual variable for ngModels
  indvdAddressType = "";
  indvdAddress = "";
  indvdCountry = "";
  indvdCity = "";
  indvdZipCode = "";

  indvdContactType = "";
  indvdContactNumber = "";
  indvdEmailAdrs = "";

  indvdListIndex = 0;
  indvdEditIndex = 0;

  txtdPassword = "";
  txtdPin = "";
  dCompanyId = "";
  cmpnyHeadingLabel = "";

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
    { BusinessTypeCd: 3, BusinessTypeName: "Public Company" }
  ];

  public imagePath;
  imgURL: any;

  //List Variables
  addressList = [];
  contactList = [];
  emailList = [];
  socialMedialList = [];

  indvdDetailList = [];
  indvdAddressList = [];
  indvdContactList = [];
  indvdEmailList = [];

  companyDetail = [];
  compSumDetail = [];

  selectedFile: File = null;
  image;
  imgFile;
  progress;

  constructor(
    private toastr: ToastrManager,
    private app: AppComponent,
    private http: HttpClient,
    // private excelExportService: IgxExcelExporterService,
    // private csvExportService: IgxCsvExporterService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.getCompany();
    this.getCompanyDetail();
    this.getStakeHolder();
    this.getCountry();
    this.getContactType();
    this.getCity();
    this.getCurrency();
    this.getBusinessType();

    if (this.router.url == "/Comp/newcmpany") {
      this.companyEditMode = false;
      this.cmpnyHeadingLabel = "Add";
    } else {
      this.companyEditMode = true;
      this.cmpnyHeadingLabel = "Edit";
    }
  }

  // // @ViewChild("excelDataContent") public excelDataContent: IgxGridComponent; //For excel
  @ViewChild("exportPDF") public exportPDF: ElementRef; //for pdf

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
    let reader = new FileReader();

    reader.onloadend = (e: any) => {
      this.image = reader.result;

      var splitImg = this.image.split(",")[1];
      this.image = splitImg;
      this.imageUrl = e.target.result;
    };

    reader.readAsDataURL(this.selectedFile);
  }

  showFile() {
    // alert('ok')
    //     $('#input-file-id').click();
    //     var reader = new FileReader();
    // this.imagePath = files;
    // reader.readAsDataURL(files[0]);
    // reader.onload = (_event) => {
    //   this.imgURL = reader.result;
    // }
  }

  preview(files) {}

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
            value: data[i].addressTypeCd
          });
        }
        //alert(this.addressType)
      });
  }

  getContactType() {
    //return false;

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getContactType", { headers: reqHeader })
      .subscribe((data: any) => {
        this.cntctTypeList = data;
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

  getCompany() {
    //return false;

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getCompany", { headers: reqHeader })
      .subscribe((data: any) => {
        this.cmpnyList = data;
      });
  }

  getCompanyDetail() {
    //return false;

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getCompanyDetail", { headers: reqHeader })
      .subscribe((data: any) => {
        this.cmpnyDetailList = data;
      });
  }

  getStakeHolder() {
    //return false;

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getStakeHolder", { headers: reqHeader })
      .subscribe((data: any) => {
        this.stakeHolderList = data;
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
        //alert(this.addressType)
      });
  }

  getCurrency() {
    //return false;

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getCurrency", { headers: reqHeader })
      .subscribe((data: any) => {
        this.crncyList = data;
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

  getBusinessType() {
    //return false;

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getBusinessType", { headers: reqHeader })
      .subscribe((data: any) => {
        this.businessTypeList = data;
      });
  }

  //* Function for save and update company
  save() {
    if (this.cmbCType == "") {
      this.toastr.errorToastr("Please select ownership type", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.companyName == "") {
      this.toastr.errorToastr("Please enter company name", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.cNtn == "") {
      this.toastr.errorToastr(
        "Please enter registration number or NTN",
        "Error",
        { toastTimeout: 2500 }
      );
      return false;
    } else if (this.cStrn == "") {
      this.toastr.errorToastr("Please enter STRN", "Error", {
        toastTimeout: 2500
      });
      return false;
    }
    // else if (this.cBusinessType == "") {
    //   this.toastr.errorToastr("Please select business type", "Error", {
    //     toastTimeout: 2500
    //   });
    //   return false;
    // }
    else if (this.cEmployeQty == "") {
      this.toastr.errorToastr("Please enter number of employees", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.cCurrency == "") {
      this.toastr.errorToastr("Please select currency", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.cAddress == "") {
      this.toastr.errorToastr("Please enter address", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.cCountry == "") {
      this.toastr.errorToastr("Please select country", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.cCity == "") {
      this.toastr.errorToastr("Please select city", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.cZipCode == "") {
      this.toastr.errorToastr("Please enter zip code", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.contactList.length == 0) {
      this.toastr.errorToastr("Please enter contact detail", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.emailList.length == 0) {
      this.toastr.errorToastr("Please enter email", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else {
      if (this.solePro == true && this.addIndividual() == false) {
        return false;
      } else if (this.partner == true && this.indvdDetailList.length == 0) {
        this.toastr.errorToastr("Please enter partners information", "Error", {
          toastTimeout: 2500
        });
        return false;
      } else if (this.ppCom == true && this.indvdDetailList.length == 0) {
        this.toastr.errorToastr("Please enter directors information", "Error", {
          toastTimeout: 2500
        });
        return false;
      } else {
        if (this.addressList.length == 0) {
          this.addressList.push({
            contactDetailCode: 0,
            addressId: 0,
            addressType: 2,
            address: this.cAddress,
            cityCode: this.cCity,
            districtCode: 0,
            provinceCode: 0,
            countryCode: this.cCountry,
            zipCode: this.cZipCode,
            status: 0
          });
        } else {
          this.addressList[0].address = this.cAddress;
          this.addressList[0].cityCode = this.cCity;
          this.addressList[0].countryCode = this.cCountry;
          this.addressList[0].zipCode = this.cZipCode;
        }

        var indvdDetailList = this.indvdDetailList;
        // alert(indvdDetailList.length);
        this.indvdDetailList = [];

        for (var i = 0; i < indvdDetailList.length; i++) {
          if (indvdDetailList[i].status == 0) {
            this.indvdDetailList.push(indvdDetailList[i]);
          }
        }

        var imgPath = null;
        if (this.image != undefined) {
          imgPath = this.imgPath;
        }

        //alert("File = " + this.image + " ------- Path " + this.imgPath);
        //return false;

        if (this.companyId != "") {
          this.app.showSpinner();

          var updateData = {
            companyId: this.companyId,
            businessType: Number(this.cmbCType),
            companyTitle: this.companyName,
            //companyNature: this.cBusinessType,
            companyNature: this.cmbCType,
            companyDesc: "",
            companyNtn: this.cNtn,
            companyStrn: this.cStrn,
            address: JSON.stringify(this.addressList),
            email: JSON.stringify(this.emailList),
            telephone: JSON.stringify(this.contactList),
            indvdl: JSON.stringify(this.indvdDetailList),
            iAddress: JSON.stringify(this.indvdAddressList),
            iEmail: JSON.stringify(this.indvdEmailList),
            iTelephone: JSON.stringify(this.indvdContactList),
            employessQty: this.cEmployeQty,
            currency: this.cCurrency,
            website: null,
            fbId: null,
            file: this.image,
            path: imgPath
          };

          //var token = localStorage.getItem(this.tokenKey);
          //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

          this.http
            .post(this.serverUrl + "api/updateCompany", updateData, {
              headers: reqHeader
            })
            .subscribe((data: any) => {
              if (data.msg == "Record Updated Successfully!") {
                this.toastr.successToastr(data.msg, "Success!", {
                  toastTimeout: 2500
                });
                this.clear();
                this.getCompany();
                this.getCompanyDetail();
                this.getStakeHolder();
                this.app.hideSpinner();
                return false;
              } else {
                this.toastr.errorToastr(data.msg, "Error!", {
                  toastTimeout: 2500
                });
                this.app.hideSpinner();
                return false;
              }
            });

          // this.toastr.successToastr('validation complete information', 'Success!', { toastTimeout: (2500) });
          // return false;
        } else {
          this.app.showSpinner();

          var saveData = {
            comanyId: 0,
            businessType: Number(this.cmbCType),
            companyTitle: this.companyName,
            //companyNature: this.cBusinessType,
            companyNature: this.cmbCType,
            companyDesc: "",
            companyNtn: this.cNtn,
            companyStrn: this.cStrn,
            address: JSON.stringify(this.addressList),
            email: JSON.stringify(this.emailList),
            telephone: JSON.stringify(this.contactList),
            indvdl: JSON.stringify(this.indvdDetailList),
            iAddress: JSON.stringify(this.indvdAddressList),
            iEmail: JSON.stringify(this.indvdEmailList),
            iTelephone: JSON.stringify(this.indvdContactList),
            employessQty: this.cEmployeQty,
            currency: this.cCurrency,
            website: null,
            fbId: null,
            file: this.image,
            path: imgPath
          };

          // var token = localStorage.getItem(this.tokenKey);
          // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json"
          });

          // this.http.post(this.serverUrl + 'api/saveCompany', saveData, { headers: reqHeader }).subscribe((data: any) => {
          this.http
            .post(this.serverUrl + "api/saveCompany", saveData, {
              headers: reqHeader
            })
            .subscribe((data: any) => {
              if (data.msg != undefined) {
                this.toastr.successToastr(data.msg, "Success!", {
                  toastTimeout: 2500
                });
                //this.getCompany();
                //$('#companyModal').modal('hide');
                this.clear();
                this.getCompany();
                this.getCompanyDetail();
                this.getStakeHolder();
                this.app.hideSpinner();
                return false;
              } else {
                this.toastr.errorToastr(data.msg, "Error!", {
                  toastTimeout: 2500
                });
                //$('#companyModal').modal('hide');
                this.app.hideSpinner();
                return false;
              }
            });
        }
      }
    }
  }

  //**************** Function for add new partner for company
  addIndividual() {
    //if type is solo
    if (this.solePro == true) {
      if (this.oName.trim() == "") {
        this.toastr.errorToastr("Please enter owner name", "Error", {
          toastTimeout: 2500
        });
        return false;
      } else if (
        this.oCNIC == null ||
        this.oCNIC == "" ||
        this.oCNIC.length < 13
      ) {
        this.toastr.errorToastr("Please enter owner cnic", "Error", {
          toastTimeout: 2500
        });
        return false;
      } else if (this.indvdAddress.trim() == "") {
        this.toastr.errorToastr("Please enter owner address", "Error", {
          toastTimeout: 2500
        });
        return false;
      } else if (this.indvdCountry == "") {
        this.toastr.errorToastr("Please enter owner country", "Error", {
          toastTimeout: 2500
        });
        return false;
      } else if (this.indvdCity == "") {
        this.toastr.errorToastr("Please enter owner city", "Error", {
          toastTimeout: 2500
        });
        return false;
      } else if (this.indvdZipCode == "") {
        this.toastr.errorToastr("Please enter owner zipcode", "Error", {
          toastTimeout: 2500
        });
        return false;
      } else if (this.indvdContactList.length == 0) {
        this.toastr.errorToastr("Please enter owner contact detail", "Error", {
          toastTimeout: 2500
        });
        return false;
      } else if (this.indvdEmailList.length == 0) {
        this.toastr.errorToastr("Please enter owner email", "Error", {
          toastTimeout: 2500
        });
        return false;
      } else {
        if (this.indvdDetailList.length == 0) {
          this.indvdAddressList.push({
            contactDetailCode: 0,
            addressId: 0,
            addressType: 1,
            address: this.indvdAddress,
            cityCode: this.indvdCity,
            districtCode: 0,
            provinceCode: 0,
            countryCode: this.indvdCountry,
            zipCode: this.indvdZipCode,
            status: 0,
            index: 1 //index: this.indvdDetailList.length + 1,
          });

          this.indvdDetailList.push({
            indvdlId: 0,
            index: this.indvdDetailList.length + 1,
            typeCd: this.cmbCType,
            name: this.oName,
            cnic: this.oCNIC,
            share: 0,
            type: "owner",
            status: 0
          });
        } else {
          this.indvdDetailList[0].index = 1;
          this.indvdDetailList[0].typeCd = this.cmbCType;
          this.indvdDetailList[0].name = this.oName;
          this.indvdDetailList[0].cnic = this.oCNIC;

          this.indvdAddressList[0].address = this.indvdAddress;
          this.indvdAddressList[0].cityCode = this.indvdCity;
          this.indvdAddressList[0].countryCode = this.indvdCountry;
          this.indvdAddressList[0].zipCode = this.indvdZipCode;
        }

        this.clearIndividual();
      }
    }

    //if type is partner
    if (this.partner == true) {
      if (this.pType.trim() == "") {
        this.toastr.errorToastr("Please enter partner type", "Error", {
          toastTimeout: 2500
        });
        return false;
      } else if (this.pShare == "") {
        this.toastr.errorToastr("Please enter share percentage", "Error", {
          toastTimeout: 2500
        });
        return false;
      } else if (this.pName.trim() == "") {
        this.toastr.errorToastr("Please enter partner name", "Error", {
          toastTimeout: 2500
        });
        return false;
      } else if (
        this.pCNIC == null ||
        this.pCNIC == "" ||
        this.pCNIC.length < 13
      ) {
        this.toastr.errorToastr("Please enter partner cnic", "Error", {
          toastTimeout: 2500
        });
        return false;
      } else if (this.indvdAddress.trim() == "") {
        this.toastr.errorToastr("Please enter owner address", "Error", {
          toastTimeout: 2500
        });
        return false;
      } else if (this.indvdCountry == "") {
        this.toastr.errorToastr("Please enter owner country", "Error", {
          toastTimeout: 2500
        });
        return false;
      } else if (this.indvdCity == "") {
        this.toastr.errorToastr("Please enter owner city", "Error", {
          toastTimeout: 2500
        });
        return false;
      } else if (this.indvdZipCode == "") {
        this.toastr.errorToastr("Please enter owner zipcode", "Error", {
          toastTimeout: 2500
        });
        return false;
      } else if (this.indvdContactList.length == 0) {
        this.toastr.errorToastr("Please enter owner contact detail", "Error", {
          toastTimeout: 2500
        });
        return false;
      } else if (this.indvdEmailList.length == 0) {
        this.toastr.errorToastr("Please enter owner email", "Error", {
          toastTimeout: 2500
        });
        return false;
      } else {
        //condition for addition or updation indvd address
        if (this.indvdEditIndex == 0) {
          this.indvdAddressList.push({
            contactDetailCode: 0,
            addressId: 0,
            addressType: 1,
            address: this.indvdAddress,
            cityCode: this.indvdCity,
            districtCode: 0,
            provinceCode: 0,
            countryCode: this.indvdCountry,
            zipCode: this.indvdZipCode,
            status: 0,
            index: this.indvdDetailList.length + 1
          });
        } else {
          for (var i = 0; i < this.indvdAddressList.length; i++) {
            if (this.indvdAddressList[i].index == this.indvdEditIndex) {
              this.indvdAddressList[i].address = this.indvdAddress;
              this.indvdAddressList[i].cityCode = this.indvdCity;
              this.indvdAddressList[i].countryCode = this.indvdCountry;
              this.indvdAddressList[i].zipCode = this.indvdZipCode;
            }
          }
        }

        if (this.indvdEditIndex == 0) {
          let data = this.indvdDetailList.find(x => x.cnic == this.pCNIC);

          if (data != undefined) {
            this.toastr.errorToastr("Partner already exist", "Error", {
              toastTimeout: 2500
            });
            return false;
          } else {
            this.indvdDetailList.push({
              indvdlId: 0,
              index: this.indvdDetailList.length + 1,
              typeCd: this.cmbCType,
              name: this.pName,
              cnic: this.pCNIC,
              share: this.pShare,
              type: this.pType,
              status: 0
            });

            this.clearIndividual();
          }
        } else {
          for (var i = 0; i < this.indvdDetailList.length; i++) {
            if (this.indvdDetailList[i].index == this.indvdEditIndex) {
              this.indvdDetailList[i].name = this.pName;
              this.indvdDetailList[i].cnic = this.pCNIC;
              this.indvdDetailList[i].share = this.pShare;
              this.indvdDetailList[i].type = this.pType;
            }
          }

          this.clearIndividual();
        }
      }
    }

    //if type is public
    if (this.ppCom == true) {
      if (this.dTitle.trim() == "") {
        this.toastr.errorToastr("Please enter director title", "Error", {
          toastTimeout: 2500
        });
        return false;
      } else if (this.dShare == "") {
        this.toastr.errorToastr("Please enter share percentage", "Error", {
          toastTimeout: 2500
        });
        return false;
      } else if (this.dName.trim() == "") {
        this.toastr.errorToastr("Please enter director name", "Error", {
          toastTimeout: 2500
        });
        return false;
      } else if (
        this.dCNIC == null ||
        this.dCNIC == "" ||
        this.dCNIC.length < 13
      ) {
        this.toastr.errorToastr("Please enter director cnic", "Error", {
          toastTimeout: 2500
        });
        return false;
      } else if (this.indvdAddress.trim() == "") {
        this.toastr.errorToastr("Please enter owner address", "Error", {
          toastTimeout: 2500
        });
        return false;
      } else if (this.indvdCountry == "") {
        this.toastr.errorToastr("Please enter owner country", "Error", {
          toastTimeout: 2500
        });
        return false;
      } else if (this.indvdCity == "") {
        this.toastr.errorToastr("Please enter owner city", "Error", {
          toastTimeout: 2500
        });
        return false;
      } else if (this.indvdZipCode == "") {
        this.toastr.errorToastr("Please enter owner zipcode", "Error", {
          toastTimeout: 2500
        });
        return false;
      } else if (this.indvdContactList.length == 0) {
        this.toastr.errorToastr("Please enter owner contact detail", "Error", {
          toastTimeout: 2500
        });
        return false;
      } else if (this.indvdEmailList.length == 0) {
        this.toastr.errorToastr("Please enter owner email", "Error", {
          toastTimeout: 2500
        });
        return false;
      } else {
        //condition for addition or updation indvd address
        if (this.indvdEditIndex == 0) {
          this.indvdAddressList.push({
            contactDetailCode: 0,
            addressId: 0,
            addressType: 1,
            address: this.indvdAddress,
            cityCode: this.indvdCity,
            districtCode: 0,
            provinceCode: 0,
            countryCode: this.indvdCountry,
            zipCode: this.indvdZipCode,
            status: 0,
            index: this.indvdDetailList.length + 1
          });
        } else {
          for (var i = 0; i < this.indvdAddressList.length; i++) {
            if (this.indvdAddressList[i].index == this.indvdEditIndex) {
              this.indvdAddressList[i].address = this.indvdAddress;
              this.indvdAddressList[i].cityCode = this.indvdCity;
              this.indvdAddressList[i].countryCode = this.indvdCountry;
              this.indvdAddressList[i].zipCode = this.indvdZipCode;
            }
          }
        }

        if (this.indvdEditIndex == 0) {
          let data = this.indvdDetailList.find(x => x.cnic == this.dCNIC);

          if (data != undefined) {
            this.toastr.errorToastr("Director already exist", "Error", {
              toastTimeout: 2500
            });
            return false;
          } else {
            this.indvdDetailList.push({
              indvdlId: 0,
              index: this.indvdDetailList.length + 1,
              typeCd: this.cmbCType,
              name: this.dName,
              cnic: this.dCNIC,
              share: this.dShare,
              type: this.dTitle,
              status: 0
            });

            this.clearIndividual();
          }
        } else {
          for (var i = 0; i < this.indvdDetailList.length; i++) {
            if (this.indvdDetailList[i].index == this.indvdEditIndex) {
              this.indvdDetailList[i].name = this.dName;
              this.indvdDetailList[i].cnic = this.dCNIC;
              this.indvdDetailList[i].share = this.dShare;
              this.indvdDetailList[i].type = this.dTitle;
            }
          }

          this.clearIndividual();
        }
      }
    }
  }

  //**************** Function for empty all fields of partner information
  clearIndividual() {
    this.oName = "";
    this.oCNIC = "";

    this.pType = "";
    this.pShare = "";
    this.pName = "";
    this.pCNIC = "";

    this.dTitle = "";
    this.dShare = "";
    this.dName = "";
    this.dCNIC = "";

    this.indvdAddressType = "";
    this.indvdAddress = "";
    this.indvdCountry = "";
    this.indvdCity = "";
    this.indvdZipCode = "";
    this.indvdContactType = "";
    this.indvdContactNumber = "";
    this.indvdEmailAdrs = "";

    this.indvdListIndex = 0;
    this.indvdEditIndex = 0;
  }

  //*Edit function
  edit() {
    var cmpnyId = this.companyId;
    this.clear();
    this.companyId = cmpnyId;

    //getting company name
    var tempCmpnyData = [];
    tempCmpnyData = this.cmpnyList.filter(x => x.companyId == cmpnyId);

    //geting Company DATA
    if (tempCmpnyData.length > 0) {
      this.companyName = tempCmpnyData[0].companyTitle;
    }

    tempCmpnyData = [];
    tempCmpnyData = this.cmpnyDetailList.filter(x => x.companyId == cmpnyId);

    //geting Company DATA
    if (tempCmpnyData.length > 0) {
      //this.cmbCType = tempCmpnyData[0].businessType;
      this.cNtn = tempCmpnyData[0].companyNtn;
      this.cStrn = tempCmpnyData[0].companyStrn;
      this.cmbCType = tempCmpnyData[0].businessType;
      this.cBusinessType = tempCmpnyData[0].businessType;
      this.cEmployeQty = tempCmpnyData[0].employees;
      this.cCurrency = tempCmpnyData[0].currency;
      this.imageUrl =
        "../assets/images/CmpnyImages/" +
        tempCmpnyData[0].companyTitle +
        ".jpg";
    }

    for (var i = 0; i < tempCmpnyData.length; i++) {
      //gnrtng email lst
      if (tempCmpnyData[i].emailTypeCd != 0) {
        this.emailList.push({
          contactDetailCode: tempCmpnyData[i].cntctDetailCd,
          emailId: 0,
          type: tempCmpnyData[i].emailTypeCd,
          status: 1,
          email: tempCmpnyData[i].emailAddrss
        });
      }

      //gnrtng cntct lst
      if (tempCmpnyData[i].teleNo != null) {
        this.contactList.push({
          contactDetailCode: tempCmpnyData[i].cntctDetailCd,
          telId: 0,
          contactType: tempCmpnyData[i].cntctTypeCd,
          status: 1,
          contactNumber: tempCmpnyData[i].teleNo,
          mobileNumber: "",
          countryCode: 0
        });
      }

      //gnrtng adrs lst
      if (tempCmpnyData[i].addressTypeCd != 0) {
        this.addressList.push({
          contactDetailCode: tempCmpnyData[i].cntctDetailCd,
          addressId: 0,
          addressType: tempCmpnyData[i].addressTypeCd,
          address: tempCmpnyData[i].addressLine1,
          cityCode: tempCmpnyData[i].thslCd,
          districtCode: 0,
          provinceCode: 0,
          countryCode: tempCmpnyData[i].addCntryCd,
          zipCode: tempCmpnyData[i].zipCode,
          status: 1
        });

        this.cAddress = tempCmpnyData[i].addressLine1;
        this.cCountry = tempCmpnyData[i].addCntryCd;
        this.cCity = tempCmpnyData[i].thslCd;
        this.cZipCode = tempCmpnyData[i].zipCode;
      }
    }

    //geting Stack Holder Data
    var tempIndvdData = [];
    tempIndvdData = this.stakeHolderList.filter(x => x.cmpnyID == cmpnyId);

    if (tempIndvdData.length > 0) {
      this.cmbCType = tempIndvdData[0].stakeHolderTypeCd;
      this.allowDiv();
    }

    //geting owner data
    if (this.solePro == true) {
      for (var i = 0; i < tempIndvdData.length; i++) {
        //geting indvd detail code
        this.indvdDetailList.push({
          indvdlId: tempIndvdData[0].indvdlID,
          index: 1,
          typeCd: tempIndvdData[0].stakeHolderTypeCd,
          name: tempIndvdData[0].indvdlFullName,
          cnic: tempIndvdData[0].cnic,
          share: 0,
          type: "owner",
          status: 0
        });

        this.oName = tempIndvdData[0].indvdlFullName;
        this.oCNIC = tempIndvdData[0].cnic;

        //gnrtng email lst
        if (tempIndvdData[i].emailTypeCd != 0) {
          this.indvdEmailList.push({
            contactDetailCode: tempIndvdData[i].cntctDetailCd,
            emailId: 0,
            type: tempIndvdData[i].emailTypeCd,
            status: 0,
            email: tempIndvdData[i].emailAddrss,
            index: 1
          });
        }

        //gnrtng cntct lst
        if (tempIndvdData[i].teleNo != null) {
          this.indvdContactList.push({
            contactDetailCode: tempIndvdData[i].cntctDetailCd,
            telId: 0,
            contactType: tempIndvdData[i].cntctTypeCd,
            status: 0,
            contactNumber: tempIndvdData[i].teleNo,
            mobileNumber: "",
            countryCode: 0,
            index: 1
          });
        }

        //gnrtng adrs lst
        if (tempIndvdData[i].addressTypeCd != 0) {
          this.indvdAddressList.push({
            contactDetailCode: tempIndvdData[i].cntctDetailCd,
            addressId: 0,
            addressType: tempIndvdData[i].addressTypeCd,
            address: tempIndvdData[i].addressLine1,
            cityCode: tempIndvdData[i].thslCd,
            districtCode: 0,
            provinceCode: 0,
            countryCode: tempIndvdData[i].addCntryCd,
            zipCode: tempIndvdData[i].zipCode,
            status: 0,
            index: 1
          });

          this.indvdAddress = tempIndvdData[i].addressLine1;
          this.indvdCountry = tempIndvdData[i].addCntryCd;
          this.indvdCity = tempIndvdData[i].thslCd;
          this.indvdZipCode = tempIndvdData[i].zipCode;
        }
      }
    }

    //geting partner or director data
    if (this.solePro == false) {
      var totalIndvdList = [];
      var tmpId = 0;
      for (var i = 0; i < tempIndvdData.length; i++) {
        if (i == 0) {
          totalIndvdList.push({
            indvdId: tempIndvdData[i].indvdlID
          });
          tmpId = tempIndvdData[i].indvdlID;
        } else {
          if (tempIndvdData[i].indvdlID != tmpId) {
            totalIndvdList.push({
              indvdId: tempIndvdData[i].indvdlID
            });
            tmpId = tempIndvdData[i].indvdlID;
          }
        }
      }

      if (tempIndvdData.length > 0) {
        this.cmbCType = tempIndvdData[0].stakeHolderTypeCd;
        this.allowDiv();
      }

      for (var j = 0; j < totalIndvdList.length; j++) {
        tempIndvdData = [];
        tempIndvdData = this.stakeHolderList.filter(
          x => x.cmpnyID == cmpnyId && x.indvdlID == totalIndvdList[j].indvdId
        );

        //geting indvd detail code
        this.indvdDetailList.push({
          indvdlId: tempIndvdData[j].indvdlID,
          typeCd: tempIndvdData[j].stakeHolderTypeCd,
          name: tempIndvdData[j].indvdlFullName,
          cnic: tempIndvdData[j].cnic,
          share: tempIndvdData[j].prcntgofShrsOwn,
          type: tempIndvdData[j].type,
          status: 0,
          index: j + 1
        });

        for (var i = 0; i < tempIndvdData.length; i++) {
          //gnrtng email lst
          if (tempIndvdData[i].emailTypeCd != 0) {
            this.indvdEmailList.push({
              contactDetailCode: tempIndvdData[i].cntctDetailCd,
              emailId: 0,
              type: tempIndvdData[i].emailTypeCd,
              status: 0,
              email: tempIndvdData[i].emailAddrss,
              index: j + 1
            });
          }

          //gnrtng cntct lst
          if (tempIndvdData[i].teleNo != null) {
            this.indvdContactList.push({
              contactDetailCode: tempIndvdData[i].cntctDetailCd,
              telId: 0,
              contactType: tempIndvdData[i].cntctTypeCd,
              status: 0,
              contactNumber: tempIndvdData[i].teleNo,
              mobileNumber: "",
              countryCode: 0,
              index: j + 1
            });
          }

          //gnrtng adrs lst
          if (tempIndvdData[i].addressTypeCd != 0) {
            this.indvdAddressList.push({
              contactDetailCode: tempIndvdData[i].cntctDetailCd,
              addressId: 0,
              addressType: tempIndvdData[i].addressTypeCd,
              address: tempIndvdData[i].addressLine1,
              cityCode: tempIndvdData[i].thslCd,
              districtCode: 0,
              provinceCode: 0,
              countryCode: tempIndvdData[i].addCntryCd,
              zipCode: tempIndvdData[i].zipCode,
              status: 0,
              index: j + 1
            });

            this.indvdAddress = tempIndvdData[i].addressLine1;
            this.indvdCountry = tempIndvdData[i].addCntryCd;
            this.indvdCity = tempIndvdData[i].thslCd;
            this.indvdZipCode = tempIndvdData[i].zipCode;
          }
        }
      }
    }
  }

  //*function for empty all fields
  clear() {
    this.companyId = "";
    this.cmbCType = "";

    this.companyName = "";
    this.cNtn = "";
    this.cStrn = "";
    this.cBusinessType = "";
    this.cEmployeQty = "";
    this.cCurrency = "";
    this.cAddressType = "";
    this.cAddress = "";
    this.cCountry = "";
    this.cCity = "";
    this.cZipCode = "";
    this.cContactType = "";
    this.cContactNumber = "";
    this.cEmailAdrs = "";

    this.addressList = [];
    this.contactList = [];
    this.emailList = [];

    this.clearIndividual();

    this.txtdPassword = "";
    this.txtdPin = "";
    this.dCompanyId = "";

    this.indvdDetailList = [];
    this.indvdAddressList = [];
    this.indvdContactList = [];
    this.indvdEmailList = [];

    this.imgFile = undefined;
    this.image = undefined;
    this.selectedFile = null;
    this.imageUrl = "../assets/images/EmpImages/uploadlogo.jpg";
  }

  //* function for edit existing currency
  editIndividual(item) {
    this.indvdListIndex = item.index;
    this.indvdEditIndex = item.index;

    if (this.partner == true) {
      this.pType = item.type;
      this.pShare = item.share;
      this.pName = item.name;
      this.pCNIC = item.cnic;
    }

    if (this.ppCom == true) {
      this.dTitle = item.type;
      this.dShare = item.share;
      this.dName = item.name;
      this.dCNIC = item.cnic;
    }

    var tempData = [];
    tempData = this.indvdAddressList.filter(x => x.index == item.index);

    this.indvdAddress = tempData[0].address;
    this.indvdCountry = tempData[0].countryCode;
    this.indvdCity = tempData[0].cityCode;
    this.indvdZipCode = tempData[0].zipCode;
  }

  deleteIndividual(ind) {
    this.indvdDetailList[ind].status = 2;
    var myIndex = this.indvdDetailList[ind].index;

    var contactData = this.indvdContactList;
    var emailData = this.indvdEmailList;
    var addressData = this.indvdAddressList;

    this.indvdContactList = [];
    this.indvdEmailList = [];
    this.indvdAddressList = [];

    for (var i = 0; i < contactData.length; i++) {
      if (contactData[i].index != myIndex) {
        this.indvdContactList.push(contactData[i]);
      }
    }

    for (var j = 0; j < emailData.length; j++) {
      if (emailData[j].index != myIndex) {
        this.indvdEmailList.push(emailData[j]);
      }
    }

    for (var k = 0; k < addressData.length; k++) {
      if (addressData[k].index != myIndex) {
        this.indvdAddressList.push(addressData[k]);
      }
    }

    this.indvdListIndex = 0;
    this.indvdEditIndex = 0;
    //this.contactList.splice(index, 1);
  }

  //* Function for remove partner from list
  remove(item) {
    var index = this.indvdDetailList.indexOf(item);
    this.indvdDetailList.splice(index, 1);
  }

  //* Function for validate email address
  isEmail(email) {
    return this.app.validateEmail(email);
  }

  //* function for sort table data
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  //* For Print Purpose
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

    setTimeout(function() {
      window.frames["frame1"].focus();
      window.frames["frame1"].print();
      frame1.remove();
    }, 500);
  }

  //* For PDF Download
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

  //* For CSV File
  public downloadCSV() {}

  //* For Exce File
  public downloadExcel() {}

  //* function for hide or unhide div
  allowDiv() {
    //alert(this.cmbCType);

    if (this.cmbCType == "") {
      this.toastr.errorToastr("Please select business type", "Error", {
        toastTimeout: 2500
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

    this.clearIndividual();
    this.indvdEmailList = [];
    this.indvdContactList = [];
    this.indvdDetailList = [];
    this.indvdAddressList = [];
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

  //======================================================================company address portion code start

  //*************** add or remove function for company address
  addAddress() {}

  removeAddress(item) {
    this.addressList.splice(item, 1);
  }

  //*************** add or remove function for company contact
  addCompanyContact() {
    if (this.cContactType == "") {
      this.toastr.errorToastr("Please select contact type", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.cContactNumber == "") {
      this.toastr.errorToastr("Please enter contact number", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else {
      var flag = false;

      for (var i = 0; i < this.contactList.length; i++) {
        if (
          this.contactList[i].contactType == this.cContactType &&
          this.contactList[i].contactNumber == this.cContactNumber
        ) {
          flag = true;
        }
      }

      if (flag == false) {
        this.contactList.push({
          contactDetailCode: 0,
          telId: 0,
          contactType: this.cContactType,
          status: 0,
          contactNumber: this.cContactNumber,
          mobileNumber: "",
          countryCode: 0
        });

        this.cContactType = "";
        this.cContactNumber = "";
      }
    }
  }

  removeContact(index) {
    this.contactList[index].status = 2;
    //this.contactList.splice(index, 1);
  }

  //*************** add or remove function for company email
  addCompanyEmail() {
    if (this.cEmailAdrs == "") {
      this.toastr.errorToastr("Please enter email address", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.app.validateEmail(this.cEmailAdrs) == false) {
      this.toastr.errorToastr("Invalid email address", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else {
      var flag = false;

      for (var i = 0; i < this.emailList.length; i++) {
        if (this.emailList[i].email == this.cEmailAdrs) {
          flag = true;
        }
      }

      if (flag == false) {
        this.emailList.push({
          contactDetailCode: 0,
          emailId: 0,
          type: 0,
          status: 0,
          email: this.cEmailAdrs
        });

        this.cEmailAdrs = "";
      }
    }
  }

  removeEmail(item) {
    this.emailList[item].status = 2;
    //this.emailList.splice(item, 1);
  }

  //------------------------------------------------------------------------ company address portion code end

  //======================================================================individual address portion code start

  //*************** add or remove function for indvidual address
  addIndvdAddress() {}

  removeIndvdAddress(item) {
    this.addressList.splice(item, 1);
  }

  //*************** add or remove function for indvidual contact
  addIndvdContact() {
    if (this.indvdContactType == "") {
      this.toastr.errorToastr("Please select contact type", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.indvdContactNumber == "") {
      this.toastr.errorToastr("Please enter contact number", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else {
      var flag = false;
      var indexNo;

      if (this.indvdListIndex == 0) {
        indexNo = this.indvdDetailList.length + 1;
      } else {
        indexNo = this.indvdListIndex;
      }

      for (var i = 0; i < this.indvdContactList.length; i++) {
        if (
          this.indvdContactList[i].contactType == this.indvdContactType &&
          this.indvdContactList[i].contactNumber == this.indvdContactNumber &&
          this.indvdContactList[i].index == indexNo
        ) {
          flag = true;
        }
      }

      if (flag == false) {
        this.indvdContactList.push({
          contactDetailCode: 0,
          telId: 0,
          contactType: this.indvdContactType,
          status: 0,
          contactNumber: this.indvdContactNumber,
          mobileNumber: "",
          countryCode: 0,
          index: indexNo
        });

        this.indvdContactType = "";
        this.indvdContactNumber = "";
        this.indvdListIndex = indexNo;
      } else {
        this.toastr.errorToastr("Contact number already exist", "Error", {
          toastTimeout: 2500
        });
        return false;
      }
    }
  }

  removeIndvdContact(index) {
    //this.contactList[index].status = 2;
    this.indvdContactList.splice(index, 1);
  }

  //*************** add or remove function for indvidual email
  addIndvdEmail() {
    if (this.indvdEmailAdrs == "") {
      this.toastr.errorToastr("Please enter email address", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else if (this.app.validateEmail(this.indvdEmailAdrs) == false) {
      this.toastr.errorToastr("Invalid email address", "Error", {
        toastTimeout: 2500
      });
      return false;
    } else {
      var flag = false;
      var indexNo;

      if (this.indvdListIndex == 0) {
        indexNo = this.indvdDetailList.length + 1;
      } else {
        indexNo = this.indvdListIndex;
      }

      for (var i = 0; i < this.indvdEmailList.length; i++) {
        if (
          this.indvdEmailList[i].email == this.indvdEmailAdrs &&
          this.indvdEmailList[i].index == indexNo
        ) {
          flag = true;
        }
      }

      if (flag == false) {
        this.indvdEmailList.push({
          contactDetailCode: 0,
          emailId: 0,
          type: 0,
          status: 0,
          email: this.indvdEmailAdrs,
          index: indexNo
        });

        this.indvdEmailAdrs = "";
        this.indvdListIndex = indexNo;
      } else {
        this.toastr.errorToastr("Email address already exist", "Error", {
          toastTimeout: 2500
        });
        return false;
      }
    }
  }

  removeIndvdEmail(item) {
    this.indvdEmailList.splice(item, 1);
  }

  //------------------------------------------------------------------------ company address portion code end
}
