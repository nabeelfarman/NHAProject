import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {

  //serverUrl = "http://localhost:9032/";
  // serverUrl = "http://52.163.189.189:9032/";
  serverUrl = "http://ambit-erp.southeastasia.cloudapp.azure.com:9032/";

  lblTime = "";
  lblComputerName = "";
  txtReason = "";
  rdbInput = "";

  constructor(
    private toastr: ToastrManager,
    private http: HttpClient
  ) { }

  ngOnInit() {
    
    var today = new Date();

    this.lblTime = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    // alert(require('getmac'));
  }

  saveAttendance(){
    
    if (this.rdbInput == '') {
      this.toastr.errorToastr('Please select IN or OUT', 'Error', { toastTimeout: (2500) });
      return;
    } else if (this.txtReason == '') {
      this.toastr.errorToastr('Please Enter Reason', 'Error', { toastTimeout: (2500) });
      return;
    } else {
      
      var saveData = {
        empID: localStorage.getItem('userID'),
        deptCd: localStorage.getItem('deptCd'),
        serverTime: this.lblTime,
        compMac: this.lblComputerName,
        inputOption: this.rdbInput,
        reason: this.txtReason
      };

      var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

      this.http.post(this.serverUrl + 'api/saveAttendance', saveData, { headers: reqHeader }).subscribe((data: any) => {

        if (data.msg == "Record Saved Successfully!") {
          this.toastr.successToastr(data.msg, 'Success!', { toastTimeout: (2500) });
          this.clear();
          //this.app.hideSpinner();
          return false;
        } else {
          this.toastr.errorToastr(data.msg, 'Error!', { toastTimeout: (2500) });
          //$('#companyModal').modal('hide');
          //this.app.hideSpinner();
          return false;
        }
      });
    }
  }
  clear(){

  }
}
