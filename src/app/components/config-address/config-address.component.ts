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

@Component({
  selector: "app-config-address",
  templateUrl: "./config-address.component.html",
  styleUrls: ["./config-address.component.scss"],
})
export class ConfigAddressComponent implements OnInit {
  // serverUrl = "http://ambit-erp.southeastasia.cloudapp.azure.com:9026/";
  serverUrl = "http://ambit-erp.southeastasia.cloudapp.azure.com:9026/";
  // serverUrl = "http://localhost:9043/";

  tokenKey = "token";

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  srchCntry;
  srchCity;
  srchAdrs;

  addressList = [];
  cntryList = [];
  cityList = [];
  adrsTypeList = [];

  addressType = "";
  address = "";
  country = "";
  city = "";
  zipCode = "";

  constructor(
    private toastr: ToastrManager,
    private http: HttpClient,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.getCountry();
    this.getCity();
    this.getAddressType();
  }

  getCountry() {
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getCountry", { headers: reqHeader })
      .subscribe((data: any) => {
        this.cntryList = data;
      });
  }

  getCity() {
    //return false;

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getDistrict", { headers: reqHeader })
      .subscribe((data: any) => {
        this.cityList = data;
      });
  }

  getAddressType() {
    //return false;

    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getAddressType", { headers: reqHeader })
      .subscribe((data: any) => {
        this.adrsTypeList = data;
      });
  }

  addAddress() {
    if (this.addressType == "") {
      this.toastr.errorToastr("Please select address type", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.address.trim() == "") {
      this.toastr.errorToastr("Please enter address", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.country == "") {
      this.toastr.errorToastr("Please select country", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.city == "") {
      this.toastr.errorToastr("Please select city", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.zipCode == "") {
      this.toastr.errorToastr("Please enter zip code", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      var flag = false;

      for (var i = 0; i < this.addressList.length; i++) {
        if (
          this.addressList[i].addressType == this.addressType &&
          this.addressList[i].address == this.address &&
          this.addressList[i].cityCode == this.city &&
          this.addressList[i].countryCode == this.country
        ) {
          flag = true;
          this.addressList[i].status = 1;
        }
      }

      var dataList1 = [];
      dataList1 = this.adrsTypeList.filter(
        (x) => x.addressTypeCd == this.addressType
      );
      var dataList2 = [];
      dataList2 = this.cntryList.filter((x) => x.cntryCd == this.country);
      var dataList3 = [];
      dataList3 = this.cityList.filter((x) => x.districtCd == this.city);

      if (flag == false) {
        this.addressList.push({
          contactDetailCode: 0,
          addressId: 0,
          addressType: this.addressType,
          address: this.address,
          cityCode: 1,
          districtCode: this.city,
          provinceCode: 6,
          countryCode: this.country,

          addressTypeName: dataList1[0].addressTypeName,
          cntryName: dataList2[0].cntryName,
          districtName: dataList3[0].districtName,

          zipCode: this.zipCode,
          status: 0,
          IDelFlag: 0,
        });

        this.addressType = "";
        this.address = "";
        this.country = "";
        this.city = "";
        this.zipCode = "";
      } else {
        this.toastr.errorToastr("Address Already Exists", "Sorry!", {
          toastTimeout: 5000,
        });
      }
    }
  }

  //Deleting address row
  removeAddress(item) {
    if (this.addressList[item].contactDetailCode == 0) {
      this.addressList.splice(item, 1);
    } else {
      this.addressList[item].status = 2;
    }
  }
}
