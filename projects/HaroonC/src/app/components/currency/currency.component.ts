import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError, filter } from "rxjs/operators";
import { OrderPipe } from "ngx-order-pipe";
import { strictEqual } from "assert";
import { AppComponent } from "src/app/app.component";

// import * as jsPDF from 'jspdf';
// import {
//   IgxExcelExporterOptions,
//   IgxExcelExporterService,
//   IgxGridComponent,
//   IgxCsvExporterService,
//   IgxCsvExporterOptions,
//   CsvFileTypes
// } from "igniteui-angular";
//import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

//----------------------------------------------------------------------------//
//-------------------Working of this typescript file are as follows-----------//
//-------------------Getting currency data into main table -------------------//
//-------------------Add new currency into database --------------------------//
//-------------------Update currency into database ---------------------------//
//-------------------Delete currency from database ---------------------------//
//-------------------Export into PDF, CSV, Excel -----------------------------//
//-------------------For sorting the record-----------------------------//
//----------------------------------------------------------------------------//

declare var $: any;
@Component({
  selector: "app-currency",
  templateUrl: "./currency.component.html",
  styleUrls: ["./currency.component.scss"],
})
export class CurrencyComponent implements OnInit {
  serverUrl = "http://ambit-erp.southeastasia.cloudapp.azure.com:9039/";
  // serverUrl = "http://localhost:5000/";
  tokenKey = "token";

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  cmbCurrency = "";
  cmbCompany = "";
  cmbCurrencyType = "";
  searchCurrency = "";

  currency = [];
  company = [];
  currencyType = [];
  companyCurrency = [];

  // list for excel data
  excelDataList = [];

  //* variables for pagination and orderby pipe
  p = 1;
  order = "info.name";
  reverse = false;
  sortedCollection: any[];
  itemPerPage = "10";

  //*variable for print css
  printCss = "{table: {'border': 'solid 1px', 'width' : '100%'}}";

  //*Variables for NgModels
  tblSearch;
  delFlag: boolean;
  cmpnyId = "";
  currencyCd = "";
  currencyTypeCd = "";

  updateFlag = false;

  //*List Variables
  currencies = [];

  constructor(
    //private exportAsService: ExportAsService,
    private toastr: ToastrManager,
    private app: AppComponent,
    private http: HttpClient,
    private orderPipe: OrderPipe // private excelExportService: IgxExcelExporterService, // private csvExportService: IgxCsvExporterService
  ) {}

  ngOnInit() {
    this.getCurrency();
    this.getCurrencyType();
    this.getCompany();
    this.getCompanyCurrency();
  }

  // @ViewChild("excelDataContent") public excelDataContent: IgxGridComponent; //For excel
  @ViewChild("exportPDF") public exportPDF: ElementRef;

  //function for get all saved currencies from db
  getCurrency() {
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getCurrency", { headers: reqHeader })
      .subscribe((data: any) => {
        this.currency = data;
      });
  }

  //function for get all saved currencies from db
  getCompany() {
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getCompany", { headers: reqHeader })
      .subscribe((data: any) => {
        this.company = data;
      });
  }

  //function for get all saved currencies from db
  getCurrencyType() {
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getCurrencyType", { headers: reqHeader })
      .subscribe((data: any) => {
        this.currencyType = data;
      });
  }

  //function for get all saved currencies from db
  getCompanyCurrency() {
    this.app.showSpinner();
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getCompanyCurrency", { headers: reqHeader })
      .subscribe((data: any) => {
        this.companyCurrency = data;
        this.app.hideSpinner();
      });
  }

  //Function for  and update currency
  save() {
    if (this.cmbCompany == "") {
      this.toastr.errorToastr("Please Select Company", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.cmbCurrencyType == "") {
      this.toastr.errorToastr("Please Select Currency Type", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.cmbCurrency == "") {
      this.toastr.errorToastr("Please Select Currency", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      this.app.showSpinner();

      var saveData = {
        currencyCd: this.cmbCurrency,
        cmpnyId: this.cmbCompany,
        currencyTypeCd: this.cmbCurrencyType,
      };
      //var token = localStorage.getItem(this.tokenKey);

      // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "api/saveCurrency", saveData, {
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
            this.app.hideSpinner();
            this.getCompanyCurrency();
            this.clear();
            return false;
          }
        });
    }
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

  //function for empty all fields
  clear() {
    this.cmbCompany = "";
    this.cmbCurrency = "";
    this.cmbCurrencyType = "";
    this.cmpnyId = "";
    this.currencyCd = "";
    this.currencyTypeCd = "";
  }

  //functions for delete currency
  deleteTemp(item) {
    this.clear();

    this.currencyCd = item.currencyCd;
    this.cmpnyId = item.cmpnyId;
    this.currencyTypeCd = item.currencyTypeCd;

    if (this.app.pin != "") {
      if (item.delFlag == false) {
        this.delFlag = true;
      } else if (item.delFlag == true) {
        this.delFlag = false;
      }
    }

    this.generatePin();
  }

  /*** Pin generation or Delete Role  ***/
  generatePin() {
    //* check if global variable is empty
    if (this.app.pin != "") {
      //* Initialize List and Assign data to list. Sending list to api
      this.app.showSpinner();

      var branchData = {
        cmpnyId: this.cmpnyId,
        currencyCd: this.currencyCd,
        currencyTypeCd: this.currencyTypeCd,
        delFlag: this.delFlag,
      };

      this.http
        .put(this.serverUrl + "api/deleteCurrency", branchData)
        .subscribe((data: any) => {
          if (
            data.msg != "Currency Successfully Activated!" &&
            data.msg != "Currency Successfully Deactivated!"
          ) {
            this.app.hideSpinner();
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 5000 });
            this.getCompanyCurrency();
            return false;
          } else {
            this.app.hideSpinner();
            this.app.pin = "";
            this.toastr.successToastr(data.msg, "Success!", {
              toastTimeout: 2500,
            });
            this.getCompanyCurrency();
            return false;
          }
        });
    } else {
      this.app.genPin();
    }
  }

  //function for sort table data
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  // Function for Print Dive *******************/
  printDiv() {
    // // var commonCss = ".commonCss{font-family: Arial, Helvetica, sans-serif; text-align: center; }";
    // // var cssHeading = ".cssHeading {font-size: 25px; font-weight: bold;}";
    // // var cssAddress = ".cssAddress {font-size: 16px; }";
    // // var cssContact = ".cssContact {font-size: 16px; }";
    // // var tableCss = "table {width: 100%; border-collapse: collapse;}    table thead tr th {text-align: left; font-family: Arial, Helvetica, sans-serif; font-weight: bole; border-bottom: 1px solid black; margin-left: -3px;}     table tbody tr td {font-family: Arial, Helvetica, sans-serif; border-bottom: 1px solid #ccc; margin-left: -3px; height: 33px;}";
    // var printCss = this.app.printCSS();
    // //printCss = printCss + "";
    // var contents = $("#printArea").html();
    // var frame1 = $('<iframe />');
    // frame1[0].name = "frame1";
    // frame1.css({ "position": "absolute", "top": "-1000000px" });
    // $("body").append(frame1);
    // var frameDoc = frame1[0].contentWindow ? frame1[0].contentWindow : frame1[0].contentDocument.document ? frame1[0].contentDocument.document : frame1[0].contentDocument;
    // frameDoc.document.open();
    // //Create a new HTML document.
    // frameDoc.document.write('<html><head><title>DIV Contents</title>' + "<style>" + printCss + "</style>");
    // //Append the external CSS file.  <link rel="stylesheet" href="../../../styles.scss" />  <link rel="stylesheet" href="../../../../node_modules/bootstrap/dist/css/bootstrap.min.css" />
    // frameDoc.document.write('<style type="text/css" media="print">/*@page { size: landscape; }*/</style>');
    // frameDoc.document.write('</head><body>');
    // //Append the DIV contents.
    // frameDoc.document.write(contents);
    // frameDoc.document.write('</body></html>');
    // frameDoc.document.close();
    // //alert(frameDoc.document.head.innerHTML);
    // // alert(frameDoc.document.body.innerHTML);
    // setTimeout(function () {
    //     window.frames["frame1"].focus();
    //     window.frames["frame1"].print();
    //     frame1.remove();
    // }, 500);
  }
}
