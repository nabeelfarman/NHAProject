import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { Chart } from "angular-highcharts";
import { AppComponent } from "src/app/app.component";
import { ToastrManager } from "ng6-toastr-notifications";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";

declare var $: any;

//*----------------------------------------------------------------------------//
//*-------------------Working of this typescript file are as follows-----------//
//*-------------------Get the list of all users -------------------------------//
//*-------------------Get the data of all event logs --------------------------//
//*-------------------Get the List of user roles ------------------------------//
//*-------------------Get the List of all user's request ----------------------//
//*-------------------Get the daily user trend  -------------------------------//
//*-------------------Get the weekly user trend -------------------------------//
//*-------------------Accepting the role request  -----------------------------//
//*-------------------Query send by user to the administrator -----------------//
//*-------------------For sorting the record-----------------------------------//
//*----------------------------------------------------------------------------//

declare var $: any;

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  serverUrl = "http://ambit-erp.southeastasia.cloudapp.azure.com:9038/";

  // serverUrl = "http://localhost:5000/";
  tokenKey = "token";

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  /*** Variable Declaration ***/

  //* Variables Declaration for chart
  Line_chart: Chart;
  // Pie_Chart: Chart;

  //* Variable Declaration for display values on page
  countAddition = 0;
  countActive = 0;
  countDeactive = 0;
  countTotal = 0;

  //* Variable Declaration for pagination and orderby pipe
  p = 1;
  order = "info.name";
  reverse = false;
  sortedCollection: any[];
  itemPerPage = "10";

  cAdditions = [];
  cUpdations = [];
  cDeactivated = [];

  pieData = [
    {
      chartName: "Banned User",
      Qty: 10,
    },
    {
      chartName: "Active User",
      Qty: 20,
    },
    {
      chartName: "InActive User",
      Qty: 6,
    },
    {
      chartName: "Web User",
      Qty: 5,
    },
    {
      chartName: "Mobile User",
      Qty: 9,
    },
  ];

  lineData = [
    {
      chartName: "Banned User",
      Qty: [10, 12, 23],
    },
    {
      chartName: "Active User",
      Qty: [8, 15, 10],
    },
    {
      chartName: "InActive User",
      Qty: [2, 8, 6],
    },
    {
      chartName: "Web User",
      Qty: [20, 16, 25],
    },
    {
      chartName: "Mobile User",
      Qty: [4, 17, 20],
    },
  ];

  /*** Construction Function ***/
  constructor(
    private http: HttpClient,
    private app: AppComponent,
    public toastr: ToastrManager,
    private actRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.PieChart_init();
    this.getUserTrend();
    this.getUserTrendChart();
  }

  //Get the daily user trend
  PieChart_init() {
    var mySeries = [];
    for (var i = 0; i < this.pieData.length; i++) {
      mySeries.push([this.pieData[i].chartName, this.pieData[i].Qty]);
    }

    // var Token = localStorage.getItem(this.tokenKey);

    // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });

    // this.http.get(this.serverUrl + 'api/usersPieChart', { headers: reqHeader }).subscribe((data: any) => {

    //   var mySeries = [];
    //   for (var i = 0; i < this.data.length; i++) {
    //     mySeries.push([this.data[i].chartName, this.data[i].Qty]);
    //   }

    //   let chart = new Chart({
    //     chart: {
    //       type: 'pie'
    //     },
    //     title: {
    //       text: 'Users pie chart'
    //     },
    //     credits: {
    //       enabled: false
    //     },
    //     plotOptions: {
    //       pie: {
    //         showInLegend: true
    //       }
    //     },
    //     series: [{
    //       name: 'Users',
    //       data: mySeries
    //     }]
    //   });
    //   this.Pie_Chart = chart;
    // });

    let chart = new Chart({
      chart: {
        type: "area",
      },
      title: {
        text: "",
      },
      xAxis: {
        categories: ["1", "2", "3", "4"],
        tickmarkPlacement: "on",
        title: {
          text: "NUMBER OF WEEKS",
        },
      },
      yAxis: {
        title: {
          text: "NUMBER OF USER PROFILES",
        },
      },
      tooltip: {
        split: true,
      },
      plotOptions: {
        area: {
          stacking: "normal",
          lineColor: "#666666",
          lineWidth: 1,
          marker: {
            lineWidth: 1,
            lineColor: "#666666",
          },
        },
      },
      series: [
        {
          name: "ADDED",
          data: [0, 2, 1, 2],
        },
        {
          name: "ACTIVE",
          data: [6, 4, 7, 8],
        },
        {
          name: "DEACTIVATED",
          data: [7, 4, 8, 9],
        },
      ],
    });
    // this.Pie_Chart = chart;
  }

  //Get the weekly user trend
  LineChart_init() {
    // var mySeries = [];

    // for (var i = 0; i < this.lineData.length; i++) {

    //   mySeries.push([this.lineData[i].chartName, [this.lineData[i].Qty]]);

    // }
    // alert(mySeries)
    //let chart;

    // for (var i = 0; i < this.lineData.length; i++) {
    //alert(this.lineData[i].chartName)
    let chart = new Chart({
      chart: {
        type: "line",
      },
      title: {
        text: "User trend for last week",
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: "UPDATIONS",
          data: this.cUpdations,
        },
        {
          name: "DEACTIVATED",
          data: this.cDeactivated,
        },
        {
          name: "ADDITIONS",
          data: this.cAdditions,
        },
      ],
    });

    this.Line_chart = chart;
    // }

    //this.Line_chart = chart;
  }

  // Get data for user trend chart
  getUserTrendChart() {
    this.app.showSpinner();

    this.http
      .get(this.serverUrl + "api/getUserTrendsChart")
      .subscribe((data: any) => {
        //this.tempRoleList = data;
        this.cAdditions = [];
        this.cUpdations = [];
        this.cDeactivated = [];

        for (var i = 0; i < data.length; i++) {
          this.cAdditions.push(data[i].addition);

          this.cUpdations.push(data[i].updation);

          this.cDeactivated.push(data[i].deactivated);
        }

        this.app.hideSpinner();
        this.LineChart_init();
      });
  }

  /*** Get How many Users are Added, Modified and Blocked ***/
  getUserTrend() {
    this.app.showSpinner();
    var itemBackup = localStorage.getItem(this.tokenKey);

    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });
    // var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + itemBackup });

    this.http
      .get(this.serverUrl + "api/getUserTrends", { headers: reqHeader })
      .subscribe((data: any) => {
        //alert(data.addition)
        this.countAddition = data[0].addition;
        this.countActive = data[0].active;
        this.countDeactive = data[0].deactivated;
        this.countTotal = data[0].total;

        this.app.hideSpinner();
      });
  }

  //
  pie_data() {}

  //*function for sort table data
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }
}
