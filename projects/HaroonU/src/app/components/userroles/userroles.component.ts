import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ToastrManager } from "ng6-toastr-notifications";
import { TreeNode } from "../../nodeTree/TreeNode";
import { NodeService } from "../../nodeTree/node.service";

import { HttpClient } from "@angular/common/http";

import { AppComponent } from "src/app/app.component";
// import {
//   IgxExcelExporterOptions,
//   IgxExcelExporterService,
//   IgxGridComponent,
//   IgxCsvExporterService,
//   IgxCsvExporterOptions,
//   CsvFileTypes
// } from "igniteui-angular";
// import * as jsPDF from "jspdf";

declare var $: any;

///////////////////////////////////////////////////////////////////////////////
/*** Module Call : User Mangement ***/
/*** Page Call : UMIS(User Role Permission) ***/
/*** Screen No : 2.2 ***/
/*** Functionality : ***/
/*** 1 - Create User Role ***/
/*** 2 - Add Or Remove Roles from different trees ***/
/*** 3 - Delete Role ***/
/*** 4 - Update Role ***/
/*** 5 - Record Sorting ***/
/*** 6 - Filter multiple item List ***/
/*** 7 - Generate Pin ***/
/*** 8 - Clear Fields ***/
/*** 9 - Export into PDF, CSV, Excel ***/
/*** Functions List :  ***/
/*** 1- getRole() ***/
/*** 2- getRoleTree(item) ***/
/*** 3- getFilterMenu(item)  ***/
/*** 4- getFilterModule() ***/
/*** 5- getMenu()  ***/
/*** 6- save() ***/
/*** 7- addRoles() ***/
/*** 8- filterRoleList(name, code) ***/
/*** 9- oldRoleList(name, code) ***/
/***10- filterNewRoleList(name, code) ***/
/***11- compareRoleList(MainRoleList, UserRoleList) ***/
/***12- delete(item) ***/
/***13- clear() ***/
/***14- edit(item) ***/
/***15- deleteRole() ***/
/***16- removeRoles() ***/
/***17- generatePin() ***/
/***18- printDiv() ***/
/***19- downPDF() ***/
/***20- downloadCSV() ***/
/***21- downloadExcel() ***/
/***22- setOrder(value) ***/

/*** For Push Data in the Object array ***/
export interface erpObject {
  erpObjctCd: string;
  erpObjctTypeCd: string;
}

@Component({
  selector: "app-userroles",
  templateUrl: "./userroles.component.html",
  styleUrls: ["./userroles.component.scss"],
})
export class UserrolesComponent implements OnInit {
  /*** Api link published in server ***/
  serverUrl = "http://ambit-erp.southeastasia.cloudapp.azure.com:9036/";

  /*** Variable Declaration ***/

  //*Variable Decalration for NgModels
  erpRoleCd = "";
  txtdPassword = "";
  txtdPin = "";
  erpRoleName = "";
  cmbModule = "";
  roleSearch = "";
  tblSearch;
  removeNodeFlag = false;

  roleHeading = "Add";
  //* Variable Declaration for pagination and orderby pipe
  p = 1;
  order = "info.name";
  reverse = false;
  sortedCollection: any[];
  itemPerPage = "10";

  //* List Declaration
  menuTree: TreeNode[];
  selectedMenu: TreeNode[];
  roleTree: TreeNode[];
  selectedRole: TreeNode[];
  public employees = [];
  public tempRoleList = [];
  public modules;
  public menus;
  public roles;
  public menuList = [];
  public children = [];
  public roleList = [];
  public roleChildren = [];
  public erpObjct: Array<erpObject> = [];
  myTempList = [];
  rolesData = [];
  excelDataList = [];

  /*** Construction Function ***/
  constructor(
    private http: HttpClient,
    // private excelExportService: IgxExcelExporterService,
    // private csvExportService: IgxCsvExporterService,
    private app: AppComponent,
    public toastr: ToastrManager
  ) {}

  /*** Page Initialization */
  ngOnInit() {
    //* Functions Call
    this.getMenu();
    this.getRole();
  }

  /*** Variable Declaration for exporting data to pdf  ***/
  // @ViewChild("excelDataContent") public excelDataContent: IgxGridComponent; //For excel
  @ViewChild("exportPDF") public exportPDF: ElementRef; // for pdf

  /*** Getting Roles List ***/

  getRole() {
    this.http
      .get(this.serverUrl + "api/getUserRoles")
      .subscribe((data: any) => {
        this.roles = data;
      });
  }

  /*** Getting Specific Roles List ***/
  getRoleTree(item) {
    this.roleTree = [];
    this.roleList = [];

    this.http
      .get(this.serverUrl + "api/getRoleTree?erpRoleCd=" + item)
      .subscribe((data: any) => {
        this.tempRoleList = data;
        this.employees = data;

        for (var i = 0; i < this.employees.length; i++) {
          //* checking if type is module
          if (this.employees[i].erpObjctTypeCd == 1) {
            this.roleChildren = [];

            for (var j = 0; j < this.employees.length; j++) {
              //* checking if type is menu and parent id matched
              if (
                this.employees[j].erpObjctTypeCd == 2 &&
                this.employees[j].parentErpObjctCd ==
                  this.employees[i].erpObjctCd
              ) {
                this.roleChildren.push({
                  label: this.employees[j].erpObjctName,
                  data: [
                    {
                      objName: this.employees[j].erpObjctName,
                      typeCode: this.employees[j].erpObjctTypeCd,
                      objCode: this.employees[j].erpObjctCd,
                      parentErpObjCd: this.employees[i].erpObjctCd,
                      parentErpObjTypeCd: this.employees[i].erpObjctTypeCd,
                      parentErpObjName: this.employees[i].erpObjctName,
                    },
                  ],
                });
              }
            }

            this.roleList.push({
              label: this.employees[i].erpObjctName,
              data: [
                {
                  objName: this.employees[i].erpObjctName,
                  typeCode: this.employees[i].erpObjctTypeCd,
                  objCode: this.employees[i].erpObjctCd,
                },
              ],
              children: this.roleChildren,
            });
          }
        }

        this.roleTree = this.roleList;
        this.removeNodeFlag = true;
        this.getMenu();
      });
  }

  /*** Menu list filter method  ***/
  getFilterMenu(item) {
    return this.tempRoleList.filter(
      (x) => x.parentErpObjctCd == item && x.erpObjctTypeCd == 2
    );
  }

  /*** Module list filter method ***/
  getFilterModule() {
    //alert(roleId);
    return this.tempRoleList.filter((x) => x.erpObjctTypeCd == 1);
  }

  /*** Getting Module & Menu List  ***/
  getMenu() {
    this.app.showSpinner();

    this.http.get(this.serverUrl + "api/getUserMenu").subscribe((data: any) => {
      this.employees = data;
      this.menuList = [];

      for (var i = 0; i < this.employees.length; i++) {
        //* checking if type is module
        if (this.employees[i].erpobjctTypeCd == 1) {
          this.children = [];

          for (var j = 0; j < this.employees.length; j++) {
            //* checking if type is menu and parent id matched
            if (
              this.employees[j].erpobjctTypeCd == 2 &&
              this.employees[j].parentErpobjctCd == this.employees[i].erpobjctCd
            ) {
              this.children.push({
                label: this.employees[j].erpobjctName,
                data: [
                  {
                    objName: this.employees[j].erpobjctName,
                    typeCode: this.employees[j].erpobjctTypeCd,
                    objCode: this.employees[j].erpobjctCd,
                    parentErpObjCd: this.employees[i].erpobjctCd,
                    parentErpObjTypeCd: this.employees[i].erpobjctTypeCd,
                    parentErpObjName: this.employees[i].erpobjctName,
                  },
                ],
              });
            }
          }

          this.menuList.push({
            label: this.employees[i].erpobjctName,
            data: [
              {
                objName: this.employees[i].erpobjctName,
                typeCode: this.employees[i].erpobjctTypeCd,
                objCode: this.employees[i].erpobjctCd,
              },
            ],
            children: this.children,
          });
        }
      }

      this.menuTree = this.menuList;

      //* checking if role list is empty and node flag also empty
      if (
        this.removeNodeFlag == false &&
        (this.roleTree == undefined || this.roleTree.length == 0)
      ) {
        this.roleTree = [];
      }
      //* checking if node flag is not empty
      if (this.removeNodeFlag == true) {
        this.compareRoleList(this.menuTree, this.roleTree);
      }

      this.app.hideSpinner();
    });
  }

  /*** Save User Role ***/
  save() {
    //* checking if role name is empty
    if (this.erpRoleName.trim().length == 0) {
      this.toastr.errorToastr("Please Enter Role Name", "Oops!", {
        toastTimeout: 2500,
      });
      return;
    }
    //* checking if role list is empty
    else if (this.roleTree == undefined) {
      this.toastr.errorToastr("Please Push Data in Role Tree", "Error", {
        toastTimeout: 2500,
      });
      return;
    }

    this.erpObjct = [];
    //* Adding role tree data to another list
    for (var i = 0; i < this.roleTree.length; i++) {
      this.erpObjct.push({
        erpObjctCd: this.roleTree[i].data[0].objCode,
        erpObjctTypeCd: this.roleTree[i].data[0].typeCode,
      });
      for (var j = 0; j < this.roleTree[i].children.length; j++)
        this.erpObjct.push({
          erpObjctCd: this.roleTree[i].children[j].data[0].objCode,
          erpObjctTypeCd: this.roleTree[i].children[j].data[0].typeCode,
        });
    }

    //* checking if role id is empty
    if (this.erpRoleCd == "") {
      //* Save User Role
      this.app.showSpinner();
      this.app.hideSpinner();

      //* Initialize List and Assign data to list. Sending list to api
      var roleData = {
        erpObjct: JSON.stringify(this.erpObjct),
        erpRoleName: this.erpRoleName,
      };

      this.http
        .post(this.serverUrl + "api/saveUserRole", roleData)
        .subscribe((data: any) => {
          //* checking if role not saved
          if (data.msg != "Record Saved Successfully!") {
            this.app.hideSpinner();
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 5000 });
            return false;
          } else {
            this.app.hideSpinner();
            this.toastr.successToastr(data.msg, "Success!", {
              toastTimeout: 2500,
            });
            this.getRole();
            $("#userRoleModal").modal("hide");
            return false;
          }
        });
    } else {
      //* Update User Role
      this.app.showSpinner();
      this.app.hideSpinner();

      //* Initialize List and Assign data to list. Sending list to api
      var rolesData = {
        erpObjct: JSON.stringify(this.erpObjct),
        erpRoleCd: this.erpRoleCd,
        erpRoleName: this.erpRoleName,
      };

      this.http
        .put(this.serverUrl + "api/updateUserRole", rolesData)
        .subscribe((data: any) => {
          //* checking if role not update
          if (data.msg != "Record Updated Successfully!") {
            this.app.hideSpinner();
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 5000 });
            return false;
          } else {
            this.app.hideSpinner();
            this.toastr.successToastr(data.msg, "Success!", {
              toastTimeout: 2500,
            });
            this.getRole();
            $("#userRoleModal").modal("hide");
            return false;
          }
        });
    }
  }

  /*** Adding Modules & Menu in role List  ***/
  addRoles() {
    //* checking if menuTree data is not selected
    if (this.selectedMenu == undefined) {
      this.toastr.errorToastr("Please Select Nodes!", "Error", {
        toastTimeout: 2500,
      });
      this.app.hideSpinner();
      return false;
    }
    //* checking if menuTree data is not selected
    else if (this.selectedMenu.length == 0) {
      this.toastr.errorToastr("Please Select Nodes!", "Error", {
        toastTimeout: 2500,
      });
      this.app.hideSpinner();
      return false;
    }

    this.roleChildren = [];
    this.myTempList = this.roleTree;
    this.roleList = [];
    this.roleTree = [];
    this.roleList = this.myTempList;

    //* checking if temporary list is not empty
    if (this.myTempList.length > 0) {
      for (var i = 0; i < this.selectedMenu.length; i++) {
        //* checking if type is menu
        if (this.selectedMenu[i].data[0].typeCode == 2) {
          var foundParent = false;
          var foundChild = false;

          for (var j = 0; j < this.roleList.length; j++) {
            //* Adding child node if parent node already exist
            if (
              this.selectedMenu[i].data[0].parentErpObjName ==
              this.roleList[j].label
            ) {
              //* loop for checking child node exist or not
              for (var k = 0; k < this.roleList[j].children.length; k++) {
                if (
                  this.selectedMenu[i].data[0].objCode ==
                  this.roleList[j].children[k].data[0].objCode
                ) {
                  foundChild = true;
                }
              }

              if (foundChild == false) {
                this.roleList[j].children.push({
                  label: this.selectedMenu[i].data[0].objName,
                  data: [
                    {
                      objName: this.selectedMenu[i].data[0].objName,
                      typeCode: this.selectedMenu[i].data[0].typeCode,
                      objCode: this.selectedMenu[i].data[0].objCode,
                      parentErpoObjCd: this.selectedMenu[i].data[0].objCode,
                    },
                  ],
                });
              }
            } else {
              this.roleChildren = [];

              //* loop for checking parent node exist or not
              for (var m = 0; m < this.roleList.length; m++) {
                if (
                  this.selectedMenu[i].data[0].parentErpObjName ==
                  this.roleList[m].label
                ) {
                  foundParent = true;
                }
              }

              if (foundParent == false) {
                this.roleChildren.push({
                  label: this.selectedMenu[i].data[0].objName,
                  data: [
                    {
                      objName: this.selectedMenu[i].data[0].objName,
                      typeCode: this.selectedMenu[i].data[0].typeCode,
                      objCode: this.selectedMenu[i].data[0].objCode,
                      parentErpoObjCd: this.selectedMenu[i].data[0].objCode,
                    },
                  ],
                });

                this.roleList.push({
                  label: this.selectedMenu[i].data[0].parentErpObjName,
                  data: [
                    {
                      objName: this.selectedMenu[i].data[0].parentErpObjName,
                      typeCode: this.selectedMenu[i].data[0].parentErpObjTypeCd,
                      objCode: this.selectedMenu[i].data[0].parentErpObjCd,
                    },
                  ],
                  children: this.roleChildren,
                });
              }
            }
          }
        }
      }
    } else {
      for (var i = 0; i < this.selectedMenu.length; i++) {
        //* checking if type is menu
        if (this.selectedMenu[i].data[0].typeCode == 2) {
          var tempRoleList = this.filterRoleList(
            this.selectedMenu[i].data[0].parentErpObjName,
            2
          );

          var newRoleList = this.filterNewRoleList(
            this.selectedMenu[i].data[0].parentErpObjName,
            1
          );

          if (newRoleList.length == 0) {
            for (var o = 0; o < tempRoleList.length; o++) {
              this.roleChildren.push({
                label: tempRoleList[o].data[0].objName,
                data: [
                  {
                    objName: tempRoleList[o].data[0].objName,
                    typeCode: tempRoleList[o].data[0].typeCode,
                    objCode: tempRoleList[o].data[0].objCode,
                    parentErpoObjCd: this.selectedMenu[i].data[0].objCode,
                  },
                ],
              });
            }

            this.roleList.push({
              label: this.selectedMenu[i].data[0].parentErpObjName,
              data: [
                {
                  objName: this.selectedMenu[i].data[0].parentErpObjName,
                  typeCode: this.selectedMenu[i].data[0].parentErpObjTypeCd,
                  objCode: this.selectedMenu[i].data[0].parentErpObjCd,
                },
              ],
              children: this.roleChildren,
            });
          }

          this.roleChildren = [];
        }
      }
    }

    this.roleTree = this.roleList;
    this.compareRoleList(this.menuTree, this.roleTree);
    this.selectedMenu = [];
    this.app.hideSpinner();
  }

  /*** Filter array ***/
  filterRoleList(name, code) {
    return this.selectedMenu.filter(
      (x) => x.data[0].parentErpObjName == name && x.data[0].typeCode == code
    );
  }

  /*** filter array  ***/
  oldRoleList(name, code) {
    return this.myTempList.filter((x) => x.label == name);
  }

  /*** filter array ***/
  filterNewRoleList(name, code) {
    return this.roleList.filter(
      (x) => x.data[0].objName == name && x.data[0].typeCode == code
    );
  }

  /*** compare node tree ***/

  compareRoleList(MainRoleList, UserRoleList) {
    //* loop for remove children nodes
    for (var i = 0; i < MainRoleList.length; i++) {
      //* loop for User role list parent node
      for (var j = 0; j < UserRoleList.length; j++) {
        //* checking if role exist in user list or not if exist then remove from main list
        if (MainRoleList[i].label == UserRoleList[j].label) {
          //* checking if children esixt or not of main list
          if (MainRoleList[i].children.length > 0) {
            //* Loop for main list children node
            for (var k = 0; k < MainRoleList[i].children.length; k++) {
              //* checking children esixt or not of user list
              if (UserRoleList[j].children.length > 0) {
                //* loop for user list children node
                for (var m = 0; m < UserRoleList[j].children.length; m++) {
                  //* checking node is exist in both list or not if exist then remove from main list
                  if (
                    MainRoleList[i].children[k].label ==
                    UserRoleList[j].children[m].label
                  ) {
                    MainRoleList[i].children.splice(k, 1);
                  }

                  //* checking if all children nodes exist in user list then remove from main list
                  if (MainRoleList[i].children.length == 0) {
                    //MainRoleList.splice(i, 1);
                  }
                }
              }
            }
          } else {
            //* checking if children not exist remove parent node
            MainRoleList.splice(i, 1);
          }
        }
      }
    }

    //* loop for remove children nodes
    for (var i = 0; i < MainRoleList.length; i++) {
      //* loop for User role list parent node
      for (var j = 0; j < UserRoleList.length; j++) {
        //* checking role exist in user list or not if exist then remove from main list
        if (
          MainRoleList[i].label == UserRoleList[j].label &&
          MainRoleList[i].children.length == 0
        ) {
          MainRoleList.splice(i, 1);
        }
      }
    }

    this.removeNodeFlag = false;
  }

  /*** Empty All Fields in page ***/
  clear() {
    this.roleHeading = "Add";
    this.roleTree = [];
    this.roleList = [];
    this.erpRoleName = "";
    this.erpRoleCd = "";
    this.txtdPassword = "";
    this.txtdPin = "";

    this.getMenu();
  }

  /*** Assign values to variables for Updation ***/

  edit(item) {
    this.roleHeading = "Edit";
    this.roleTree = [];
    this.erpRoleName = item.erpRoleName;
    this.erpRoleCd = item.erpRoleCd;
    //getting specific role data and assign it to role tree
    this.getRoleTree(this.erpRoleCd);
    return false;
  }

  /*** Clearing variables. Assign values to variables for Deletion ***/

  delete(item) {
    this.clear();

    this.erpRoleName = item.erpRoleName;
    this.erpRoleCd = item.erpRoleCd;

    this.generatePin();
  }

  /*** Delete User Role ***/
  deleteRole() {
    this.app.showSpinner();
    this.app.hideSpinner();

    //* checking if password is empty
    if (this.txtdPassword.trim().length == 0) {
      this.toastr.errorToastr("Please Enter Password", "Oops!", {
        toastTimeout: 2500,
      });
      return;
    }
    //* checking if pin is empty
    else if (this.txtdPin.trim().length == 0) {
      this.toastr.errorToastr("Please Enter Pin", "Oops!", {
        toastTimeout: 2500,
      });
      return;
    }

    //* Initialize List and Assign data to list. Sending list to api
    var roleData = {
      erpObjct: JSON.stringify(this.erpObjct),
      erpRoleCd: this.erpRoleCd,
    };

    this.http
      .put(this.serverUrl + "api/deleteUserRole", roleData)
      .subscribe((data: any) => {
        //* checking if record not Deleted
        if (data.msg != "Record Deleted Successfully!") {
          this.app.hideSpinner();
          this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 5000 });
          return false;
        } else {
          this.app.hideSpinner();
          this.toastr.successToastr(data.msg, "Success!", {
            toastTimeout: 2500,
          });
          this.getRole();
          return false;
        }
      });
  }

  /*** removing selected menu or module from role tree ***/
  removeRoles() {
    //* checking if roleTree data not selected
    if (this.selectedRole == undefined) {
      this.toastr.errorToastr("Please Select Nodes to Remove!", "Error", {
        toastTimeout: 2500,
      });
      return;
    }
    //* checking if roleTree data not selected
    else if (this.selectedRole.length == 0) {
      this.toastr.errorToastr("Please Select Nodes to Remove!", "Error", {
        toastTimeout: 2500,
      });
      return;
    }

    //* removing children nodes ------loop for selected role
    for (var i = 0; i < this.selectedRole.length; i++) {
      //* checking if type is menu
      if (this.selectedRole[i].data[0].typeCode == 2) {
        for (var j = 0; j < this.roleTree.length; j++) {
          for (var k = 0; k < this.roleTree[j].children.length; k++) {
            if (
              this.selectedRole[i].data[0].objCode ==
              this.roleTree[j].children[k].data[0].objCode
            ) {
              this.roleTree[j].children.splice(k, 1);
            }
          }
        }
      }
    }

    //* removing parent nodes ------loop for selected role
    for (var i = 0; i < this.selectedRole.length; i++) {
      if (this.selectedRole[i].data[0].typeCode == 1) {
        for (var j = 0; j < this.roleTree.length; j++) {
          if (this.roleTree[j].children.length == 0) {
            this.roleTree.splice(j, 1);
          }
        }
      }
    }

    this.selectedRole = [];
    this.removeNodeFlag = true;
    this.menuTree = [];
    this.menuList = [];
    this.getMenu();
  }

  /*** Pin generation or Delete Role  ***/
  generatePin() {
    //* check if global variable is empty
    if (this.app.pin != "") {
      //* Initialize List and Assign data to list. Sending list to api
      var roleData = {
        erpObjct: JSON.stringify(this.erpObjct),
        erpRoleCd: this.erpRoleCd,
      };

      this.http
        .put(this.serverUrl + "api/deleteUserRole", roleData)
        .subscribe((data: any) => {
          if (data.msg != "Record Deleted Successfully!") {
            this.app.hideSpinner();
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 5000 });
            return false;
          } else {
            this.app.hideSpinner();
            this.app.pin = "";
            this.toastr.successToastr(data.msg, "Success!", {
              toastTimeout: 2500,
            });
            this.getRole();
            return false;
          }
        });
    } else {
      this.app.genPin();
    }
  }

  /*** For Print Purpose ***/

  printDiv() {
    // var commonCss = ".commonCss{font-family: Arial, Helvetica, sans-serif; text-align: center; }";

    // var cssHeading = ".cssHeading {font-size: 25px; font-weight: bold;}";
    // var cssAddress = ".cssAddress {font-size: 16px; }";
    // var cssContact = ".cssContact {font-size: 16px; }";

    // var tableCss = "table {width: 100%; border-collapse: collapse;}    table thead tr th {text-align: left; font-family: Arial, Helvetica, sans-serif; font-weight: bole; border-bottom: 1px solid black; margin-left: -3px;}     table tbody tr td {font-family: Arial, Helvetica, sans-serif; border-bottom: 1px solid #ccc; margin-left: -3px; height: 33px;}";

    // var printCss = commonCss + cssHeading + cssAddress + cssContact + tableCss;

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

  /*** For PDF Download ***/
  downloadPDF() {
    // var doc = new jsPDF("p", "pt", "A4"),
    //   source = $("#printArea")[0],
    //   margins = {
    //     top: 75,
    //     right: 30,
    //     bottom: 50,
    //     left: 30,
    //     width: 50
    //   };
    // doc.fromHTML(
    //   source, // HTML string or DOM elem ref.
    //   margins.left, // x coord
    //   margins.top,
    //   {
    //     // y coord
    //     width: margins.width // max width of content on PDF
    //   },
    //   function(dispose) {
    //     // dispose: object with X, Y of the last line add to the PDF
    //     //          this allow the insertion of new lines after html
    //     doc.save("Test.pdf");
    //   },
    //   margins
    // );
  }

  /*** For CSV File ***/

  public downloadCSV() {
    // case 1: When tblSearch is empty then assign full data list
    // if (this.roleSearch == "") {
    // var completeDataList = [];
    // for (var i = 0; i < this.rolesData.length; i++) {
    //     //alert(this.tblSearch + " - " + this.departmentsData[i].departmentName)
    //     completeDataList.push({
    //     roleName: this.rolesData[i].uRoleName,
    //     noOfModule: this.rolesData[i].uNoModule,
    //     noOfPages: this.rolesData[i].uNoPage
    //     });
    // }
    // this.csvExportService.exportData(completeDataList, new IgxCsvExporterOptions("UserRoleCompleteCSV", CsvFileTypes.CSV));
    // }
    // // case 2: When tblSearch is not empty then assign new data list
    // else if (this.roleSearch != "") {
    //     var filteredDataList = [];
    //     for (var i = 0; i < this.rolesData.length; i++) {
    //         if (this.rolesData[i].uRoleName.toUpperCase().includes(this.roleSearch.toUpperCase()) ||
    //         this.rolesData[i].uNoModule.toString().toUpperCase().includes(this.roleSearch.toUpperCase()) ||
    //         this.rolesData[i].uNoPage.toString().toUpperCase().includes(this.roleSearch.toUpperCase())) {
    //         filteredDataList.push({
    //             roleName: this.rolesData[i].uRoleName,
    //             noOfModule: this.rolesData[i].uNoModule,
    //             noOfPages: this.rolesData[i].uNoPage
    //         });
    //         }
    //     }
    //     if (filteredDataList.length > 0) {
    //         this.csvExportService.exportData(filteredDataList, new IgxCsvExporterOptions("UserRoleFilterCSV", CsvFileTypes.CSV));
    //     } else {
    //         this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
    //     }
    // }
  }

  /*** For Exce File ***/
  public downloadExcel() {
    // case 1: When roleSearch is empty then assign full data list
    // if (this.roleSearch == "") {
    // for (var i = 0; i < this.rolesData.length; i++) {
    //     this.excelDataList.push({
    //     roleName: this.rolesData[i].uRoleName,
    //     noOfModule: this.rolesData[i].uNoModule,
    //     noOfPages: this.rolesData[i].uNoPage
    //     });
    // }
    // this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("UserRoleCompleteExcel"));
    // this.excelDataList = [];
    // }
    // // case 2: When tblSearch is not empty then assign new data list
    // else if (this.roleSearch != "") {
    // for (var i = 0; i < this.rolesData.length; i++) {
    //     if (this.rolesData[i].uRoleName.toUpperCase().includes(this.roleSearch.toUpperCase()) ||
    //     this.rolesData[i].uNoModule.toString().toUpperCase().includes(this.roleSearch.toUpperCase()) ||
    //     this.rolesData[i].uNoPage.toString().toUpperCase().includes(this.roleSearch.toUpperCase())) {
    //     this.excelDataList.push({
    //         roleName: this.rolesData[i].uRoleName,
    //         noOfModule: this.rolesData[i].uNoModule,
    //         noOfPages: this.rolesData[i].uNoPage
    //     });
    //     }
    // }
    // if (this.excelDataList.length > 0) {
    //     this.excelExportService.export(this.excelDataContent, new IgxExcelExporterOptions("UserRoleFilterExcel"));
    //     this.excelDataList = [];
    // }
    // else {
    //     this.toastr.errorToastr('Oops! No data found', 'Error', { toastTimeout: (2500) });
    // }
    // }
  }

  /*** function for sort table data ***/
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }
}
