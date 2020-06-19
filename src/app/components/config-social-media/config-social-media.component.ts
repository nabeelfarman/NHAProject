import {Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from "@angular/core";
import {HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError, filter } from "rxjs/operators";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ToastrManager } from "ng6-toastr-notifications";

@Component({
    selector: 'app-config-social-media',
    templateUrl: './config-social-media.component.html',
    styleUrls: ['./config-social-media.component.scss']
})
export class ConfigSocialMediaComponent implements OnInit {
    serverUrl = "http://localhost:5000/";
    tokenKey = "token";

    httpOptions = {
        headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    socialMediaList = [];
    typeList = [
        {id: 1, name: 'Facebook'},
        {id: 2, name: 'Instagram'},
        {id: 3, name: 'Twitter'},
        {id: 4, name: 'Skype'},
        {id: 5, name: 'LinkedIn'},
    ];


    sMediaType = '';
    sMediaLink = '';


    constructor(
        private toastr: ToastrManager,
        private http: HttpClient
    ) { }

    ngOnInit() {
    }


    add() {
        if (this.sMediaType == "") {
            this.toastr.errorToastr("Please select social media type", "Error", { toastTimeout: 2500 });
            return false;
        } else if (this.sMediaLink == "") {
            this.toastr.errorToastr("Please enter social media link", "Error", { toastTimeout: 2500 });
            return false;
        } else {
            var flag = false;
    
            for (var i = 0; i < this.socialMediaList.length; i++) {
                if ( this.socialMediaList[i].typeCode == this.sMediaType) 
                {
                    flag = true;
                    this.socialMediaList[i].status = 1;
                }
            }
    
            if (flag == false) {

                this.socialMediaList.push({
                    typeCode: this.sMediaType,
                    link: this.sMediaLink,
                    status: 0
                });
    
                this.sMediaType = '';
                this.sMediaLink = '';

            } else {
                this.toastr.errorToastr("Link Already Exists", "Sorry!", {toastTimeout: 5000});
                return false;
            }
        }
    }
    
    //Deleting row
    remove(index) {
        
        this.socialMediaList.splice(index, 1);
        // if (this.socialMediaList[index].contactDetailCode == 0) {
        //     this.socialMediaList.splice(index, 1);
        // } else {
        //     this.socialMediaList[index].status = 2;
        // }
    }



}
