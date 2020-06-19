import { Component, OnInit, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { FormsModule } from "@angular/forms";
import { ToastrManager } from "ng6-toastr-notifications";
import { AppComponent } from "src/app/app.component";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";

declare var $: any;

@Component({
  selector: "app-forgotpassword",
  templateUrl: "./forgotpassword.component.html",
  styleUrls: ["./forgotpassword.component.scss"],
})
export class ForgotpasswordComponent implements OnInit {
  serverUrl = "http://ambit-erp.southeastasia.cloudapp.azure.com:9010/";
  // serverUrl = "http://localhost:9010/";
  tokenKey = "token";

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  UserName = "";
  txtPassword = "";
  txtCnfrmPassword = "";

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    public toastr: ToastrManager,
    private router: Router,
    private app: AppComponent
  ) {}

  ngOnInit() {}

  //************************ Function for change password *************************/
  changePassword() {
    if (this.txtPassword == "") {
      this.toastr.errorToastr("Please Enter New Password", "Oops!", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtCnfrmPassword == "") {
      this.toastr.errorToastr("Please Enter Comfirm Password", "Oops!", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtPassword != this.txtCnfrmPassword) {
      this.toastr.errorToastr("Password doesn't match", "Oops!", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      this.app.showSpinner();
      var Token = localStorage.getItem(this.tokenKey);
      var reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Bearer " + Token,
      });

      var tempUN = btoa(this.UserName);
      var tempUserName = btoa(tempUN);

      var data = {
        IndvdlUserName: tempUserName,
        newPassword: this.txtPassword,
      };

      this.http
        .post(this.serverUrl + "api/forgotPassword", data, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg != "Password Changed Successfully!") {
            this.app.hideSpinner();
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 5000 });
            return false;
          } else {
            this.app.hideSpinner();
            this.toastr.successToastr(data.msg, "Success!", {
              toastTimeout: 2500,
            });
            this.txtPassword = "";
            this.txtCnfrmPassword = "";
            $("#forgotModal").modal("show");
            return false;
          }
        });
    }
  }

  getKeyPressed(e) {
    if (e.keyCode == 13) {
      // this.onSubmit();
    }
  }
}
