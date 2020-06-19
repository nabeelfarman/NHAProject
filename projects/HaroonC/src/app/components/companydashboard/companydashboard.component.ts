import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TreeNode } from "primeng/api";
import { AppComponent } from "../../../../../../src/app/app.component";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";

// @Component({
//   selector: "app-companydashboard",
//   templateUrl: "./companydashboard.component.html",
//   styleUrls: ["./companydashboard.component.scss"]
// })

@Component({
  selector: "app-companydashboard",
  templateUrl: "./companydashboard.component.html",
  styleUrls: ["./companydashboard.component.scss"],
  styles: [
    `
      .company.ui-organizationchart
        .ui-organizationchart-node-content.ui-person {
        padding: 0;
        border: 0 none;
      }

      .node-header,
      .node-content {
        padding: 0.5em 0.7em;
      }

      .node-header {
        background-color: #f6f6f6;
        color: #000;
      }

      .node-content {
        text-align: center;
        background-color: #f6f6f6;
      }

      .node-content img {
        border-radius: 50%;
      }

      .department-cfo {
        background-color: #7247bc;
        color: #ffffff;
      }

      .department-coo {
        background-color: #a534b6;
        color: #ffffff;
      }

      .department-cto {
        background-color: #019040;
        color: #ffffff;
      }

      .ui-person .ui-node-toggler {
        color: #495ebb !important;
      }

      .department-cto .ui-node-toggler {
        color: #ffffff !important;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class CompanydashboardComponent implements OnInit {
  serverUrl = "http://ambit-erp.southeastasia.cloudapp.azure.com:9044/";
  // serverUrl = "http://localhost:5000/";

  cmbCompany = "";
  company = [];
  //ngprime organization chart
  data1: TreeNode[];

  public orgList = [];
  public compChild = [];
  public branchChild = [];
  public deptChild = [];

  public orgData = [];

  constructor(private app: AppComponent, private http: HttpClient) {}

  ngOnInit() {
    this.getCompany();
  }

  getCompany() {
    //return false;

    this.app.showSpinner();
    //var Token = localStorage.getItem(this.tokenKey);

    //var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + Token });
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .get(this.serverUrl + "api/getCompany", { headers: reqHeader })
      .subscribe((data: any) => {
        this.company = data;
        this.app.hideSpinner();
      });
  }

  //getting organizational chart Data
  getChartData(item) {
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.app.showSpinner();
    this.http
      .get(this.serverUrl + "api/getOrgData?cmpnyID=" + item, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.orgData = data;

        this.orgList = [];
        this.compChild = [];
        this.branchChild = [];
        this.deptChild = [];

        for (var i = 0; i < this.orgData.length; i++) {
          if (this.orgData[i].companyName != null) {
            for (var j = 0; j < this.orgData.length; j++) {
              if (
                this.orgData[j].branchName != null &&
                this.orgData[j].deptName == null
              ) {
                this.branchChild = [];

                for (var k = 0; k < this.orgData.length; k++) {
                  if (
                    this.orgData[k].deptLevelNo == 1 &&
                    this.orgData[j].branchId == this.orgData[k].branchId
                  ) {
                    this.deptChild = [];

                    for (var l = 0; l < this.orgData.length; l++) {
                      if (
                        this.orgData[l].deptLevelNo == 2 &&
                        this.orgData[l].parentDeptId == this.orgData[k].deptId
                      ) {
                        this.deptChild.push({
                          label: this.orgData[l].deptName,
                          styleClass: "department-cfo",
                        });
                      }
                    }
                    this.branchChild.push({
                      label: this.orgData[k].deptName,
                      styleClass: "department-cto",
                      children: this.deptChild,
                    });
                  }
                }
                this.compChild.push({
                  label: this.orgData[j].branchName,
                  styleClass: "ui-person",
                  type: "person",
                  expanded: true,
                  data: {
                    name: "",
                    avatar: "Default-Image.jpg",
                  },
                  children: this.branchChild,
                });
              }
            }
          }

          this.orgList.push({
            label: this.orgData[i].companyName,
            styleClass: "ui-person",
            type: "person",
            expanded: true,
            data: { name: "" },
            children: this.compChild,
          });
          i = this.orgData.length + 1;
        }
        this.data1 = this.orgList;

        this.app.hideSpinner();
      });
  }
}
