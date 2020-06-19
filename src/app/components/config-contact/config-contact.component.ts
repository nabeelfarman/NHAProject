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
  selector: "app-config-contact",
  templateUrl: "./config-contact.component.html",
  styleUrls: ["./config-contact.component.scss"],
})
export class ConfigContactComponent implements OnInit {
  serverUrl = "http://ambit-erp.southeastasia.cloudapp.azure.com/:9043/";
  // serverUrl = "http://localhost:5000/";
  tokenKey = "token";

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  cntctTypeList = [];
  contactList = [];
  emailList = [];

  contactType = "";
  contactNumber = "";
  emailAdrs = "";

  constructor(private toastr: ToastrManager, private http: HttpClient) {}

  ngOnInit() {
    this.getContactType();
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

  addContact() {
    if (this.contactType == "") {
      this.toastr.errorToastr("Please select contact type", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.contactNumber == "") {
      this.toastr.errorToastr("Please enter contact number", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      var flag = false;

      for (var i = 0; i < this.contactList.length; i++) {
        if (
          this.contactList[i].contactType == this.contactType &&
          this.contactList[i].contactNumber == this.contactNumber
        ) {
          flag = true;
          this.contactList[i].status = 1;
        }
      }

      if (flag == false) {
        this.contactList.push({
          id: 0,
          contactType: this.contactType,
          countryCode: 168,
          contactNumber: this.contactNumber,
          mobileNumber: "",
          contactDetailCode: 0,
          status: 0,
          IDelFlag: 0,
        });

        this.contactType = "";
        this.contactNumber = "";
      } else {
        this.toastr.errorToastr("Contact Already Exists", "Sorry!", {
          toastTimeout: 5000,
        });
      }
    }
  }

  //Deleting contact row
  removeContact(index) {
    // alert(this.contactList[index].contactDetailCode);
    if (this.contactList[index].contactDetailCode == 0) {
      this.contactList.splice(index, 1);
    } else {
      this.contactList[index].status = 2;
    }
  }

  addEmail() {
    if (this.emailAdrs == "") {
      this.toastr.errorToastr("Please enter email address", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.validateEmail(this.emailAdrs) == false) {
      this.toastr.errorToastr("Invalid email address", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      var flag = false;

      for (var i = 0; i < this.emailList.length; i++) {
        if (this.emailList[i].email == this.emailAdrs) {
          flag = true;
          this.emailList[i].status = 1;
        }
      }

      if (flag == false) {
        this.emailList.push({
          contactDetailCode: 0,
          emailId: 0,
          type: 2,
          status: 0,
          email: this.emailAdrs,
          IDelFlag: 0,
        });

        this.emailAdrs = "";
      } else {
        this.toastr.errorToastr("Email Already Exists", "Sorry!", {
          toastTimeout: 5000,
        });
      }
    }
  }

  //Deleting address row
  removeEmail(item) {
    // this.emailList.splice(item, 1);
    if (this.emailList[item].contactDetailCode == 0) {
      this.emailList.splice(item, 1);
    } else {
      this.emailList[item].status = 2;
    }
  }

  public validateEmail(Email) {
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (!filter.test(Email)) {
      return false;
    } else {
      return true;
    }
  }
}
