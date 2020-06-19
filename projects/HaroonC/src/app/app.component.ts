import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
// import { ErpBottomSheetComponent } from './components/erp-bottom-sheet/erp-bottom-sheet.component';
import { Event, Router, NavigationStart, NavigationEnd } from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private router: Router,
    private bottomSheet: MatBottomSheet,
    private spinner: NgxSpinnerService) {

  }
  
  public hideDiv = false;

  items: MenuItem[];

  //show bottom sheet
  showBottom() {
    // this.bottomSheet.open(ErpBottomSheetComponent);
  }

  ngOnInit() {
    this.showDiv();
    this.items = [
      {
        label: 'File',
        icon: 'pi pi-fw pi-file',
        items: [{
          label: 'New',
          icon: 'pi pi-fw pi-plus',
          items: [
            { label: 'Project' },
            { label: 'Other' },
          ]
        },
        { label: 'Open' },
        { separator: true },
        { label: 'Quit' }
        ]
      },
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        items: [
          { label: 'Delete', icon: 'pi pi-fw pi-trash' },
          { label: 'Refresh', icon: 'pi pi-fw pi-refresh' }
        ]
      },
      {
        label: 'Help',
        icon: 'pi pi-fw pi-question',
        items: [
          {
            label: 'Contents'
          },
          {
            label: 'Search',
            icon: 'pi pi-fw pi-search',
            items: [
              {
                label: 'Text',
                items: [
                  {
                    label: 'Workspace'
                  }
                ]
              },
              {
                label: 'File'
              }
            ]
          }
        ]
      },
      {
        label: 'Actions',
        icon: 'pi pi-fw pi-cog',
        items: [
          {
            label: 'Edit',
            icon: 'pi pi-fw pi-pencil',
            items: [
              { label: 'Save', icon: 'pi pi-fw pi-save' },
              { label: 'Update', icon: 'pi pi-fw pi-save' },
            ]
          },
          {
            label: 'Other',
            icon: 'pi pi-fw pi-tags',
            items: [
              { label: 'Delete', icon: 'pi pi-fw pi-minus' }
            ]
          }
        ]
      },
      { separator: true },
      {
        label: 'Quit', icon: 'pi pi-fw pi-times'
      }
    ];
  }

  // //*Functions for Show & Hide Spinner
  // showSpinner() {
  //   this.spinner.show();
  // }


  // hideSpinner() {
  //     setTimeout(() => {
  //         /** spinner ends after process done*/
  //         this.spinner.hide();
  //     }, 1000);
  // }


  //method for show and hide manu bar with login and logout user
  showDiv() {
    this.hideDiv = true;
    // if (this.router.url != "/") {
    //   this.hideDiv = true;

    // } else {
    //   this.hideDiv = false;
    // }
    // if (localStorage.getItem('token') != null) {
    //     this.hideDiv = true;
    //     this.userName = localStorage.getItem('userName');
    // }
    // else {
    //     this.hideDiv = false;
    // }
  }

  //show bottom sheet
  // showBottom() {
  //   this.bottomSheet.open(ErpBottomSheetComponent);
  // }

  //mehtod for logout user
  Logout() {
    //this.stopWatching();
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this.router.navigate(['']);
    this.showDiv();
  }
  
  public printCSS() {

    var commonCss = ".commonCss{font-family: Arial, Helvetica, sans-serif; text-align: center; }";

    var cssHeading = ".cssHeading {font-size: 25px; font-weight: bold;}";
    var cssAddress = ".cssAddress {font-size: 16px; }";
    var cssContact = ".cssContact {font-size: 16px; }";

    var tableCss = "table {width: 100%; border-collapse: collapse;}    table thead tr th {text-align: left; font-family: Arial, Helvetica, sans-serif; font-weight: bole; border-bottom: 1px solid black; margin-left: -3px;}     table tbody tr td {font-family: Arial, Helvetica, sans-serif; border-bottom: 1px solid #ccc; margin-left: -3px; height: 33px;}";

    var printCss = commonCss + cssHeading + cssAddress + cssContact + tableCss;

    return printCss;
  }



  /* Set the width of the side navigation to 250px */
  public openNav() {
    document.getElementById("mySidenav").style.width = "248px";
  }

  /* Set the width of the side navigation to 0 */
  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }
}
