import { Component, OnInit, Injectable } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { ToastrManager } from "ng6-toastr-notifications";
import { AppComponent } from "src/app/app.component";

declare var $: any;

///////////////////////////////////////////////////////////////////////////////
/*** Module Call : User Mangement ***/
/*** Page Call : UMIS(User Login) ***/
/*** Screen No : 1.1 ***/
/*** Functionality : ***/
/*** 1 - Employee can make login if login exist ***/
/*** 2 - Sending Link and Save Link  ***/
/*** Functions List :  ***/
/*** 1- onSubmit() ***/
/*** 2- getUserDetail(item) ***/
/*** 3- getKeyPressed(e)  ***/
/*** 4- forgotPassword() ***/

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  providers: [MessageService],
})
export class LoginComponent implements OnInit {
  /*** Api link published in server ***/
  serverUrl = "http://ambit-erp.southeastasia.cloudapp.azure.com:9010/";
  //serverUrl = "http://localhost:9010/";
  tokenKey = "token";

  /*** http header ***/
  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  /*** Variable Declaration ***/

  //*Variable Declaration for NgModels
  txtUserName = "";
  txtPassword = "";

  /*** Construction Function ***/
  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    public toastr: ToastrManager,
    private router: Router,
    private app: AppComponent
  ) {}

  /*** Page Initialization ***/
  ngOnInit() {
    //* Functions Call
    this.app.checkLogin("Yes");
  }

  /*** checking if login exist then create token ***/
  onSubmit() {
    //* checking if login name is empty
    if (this.txtUserName.trim().length == 0) {
      this.toastr.errorToastr("Please Enter User Name", "Oops!", {
        toastTimeout: 2500,
      });
      return false;
    }
    //* checking if password is empty
    else if (this.txtPassword == "") {
      this.toastr.errorToastr("Please Enter Password", "Oops!", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      this.app.showSpinner();

      //* Initialize List and Assign data to list. Sending list to api
      var loginData = {
        IndvdlERPUsrID: this.txtUserName,
        IndvdlERPPsswrd: this.txtPassword,
      };

      //* header sending to api
      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "api/CreateToken", loginData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          //* check if message is login Successfully
          if (data.msg == "Login Successfully!") {
            this.toastr.successToastr(data.msg, "Success!", {
              toastTimeout: 2500,
            });

            this.app.hideSpinner();

            //* setting multiple items to local storage
            localStorage.setItem("userName", this.txtUserName);
            localStorage.setItem("myActModNam", "HR");
            localStorage.setItem("token", data.token);

            localStorage.setItem("loc", data.userDetail[0].locationCd);
            localStorage.setItem("ci", data.userDetail[0].cmpnyID);
            localStorage.setItem("cn", data.userDetail[0].locationName);
            localStorage.setItem("ei", data.userDetail[0].indvdlID);

            this.app.checkLogin("Yes");
            this.app.branchList = data.userDetail;

            // this.app.locationId = data.userDetail[0].locationCd;
            // this.app.cmpnyId = data.userDetail[0].cmpnyId;
            // this.app.cmpnyName = data.userDetail[0].locationName;
            // this.app.empId = data.userDetail[0].indvdlID;
          } else {
            this.app.hideSpinner();
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 2500 });
            $(".mat-form-field-underline").css("background-color", "red");
            $(".mat-form-field-label").css("color", "red");
          }
        });
    }
  }

  /*** Getting Specific User Detail ***/
  getUserDetail(item) {
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getUserDept?empID=" + item, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        localStorage.setItem("deptCd", data[0].jobPostDeptCd);
      });
  }

  /*** Capture Enter key ***/
  getKeyPressed(e) {
    if (e.keyCode == 13) {
      this.onSubmit();
    }
  }

  /*** User Forgot password ***/
  forgotPassword() {
    //* checking if login name is empty
    if (this.txtUserName.trim().length == 0) {
      this.toastr.errorToastr("Please Enter User Name", "Oops!", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      var genTime = new Date();
      var link = "http://ambit-erp.southeastasia.cloudapp.azure.com:8998?u=";
      var expTime = new Date();

      expTime.setDate(genTime.getDate() + 1);

      this.app.showSpinner();
      var Token = localStorage.getItem(this.tokenKey);
      var reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Bearer " + Token,
      });

      //* Initialize List and Assign data to list. Sending list to api
      var data = {
        IndvdlUserName: this.txtUserName,
        generationTime: genTime,
        linkURL: link,
        expiryTime: expTime,
      };

      this.http
        .post(this.serverUrl + "api/saveLink", data, { headers: reqHeader })
        .subscribe((data: any) => {
          //* checking if mail not sent
          if (data.msg != "Mail Sent!") {
            this.app.hideSpinner();
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 5000 });
            return false;
          } else {
            this.app.hideSpinner();
            this.toastr.successToastr(data.msg, "Success!", {
              toastTimeout: 2500,
            });
            return false;
          }
        });
    }
  }
}
