import { Component, OnInit } from "@angular/core";
import { AppComponent } from "src/app/app.component";

@Component({
  selector: "app-intro-page",
  templateUrl: "./intro-page.component.html",
  styleUrls: ["./intro-page.component.scss"]
})
export class IntroPageComponent implements OnInit {
  constructor(private app: AppComponent) {}

  ngOnInit() {
    this.app.openNav();
    //this.app.activeModule('Yes');
  }
}
