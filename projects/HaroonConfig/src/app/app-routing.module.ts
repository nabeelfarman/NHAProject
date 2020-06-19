import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { CertificateComponent } from "./components/certificate/certificate.component";
import { DegreeeComponent } from "./components/degreee/degreee.component";
import { SkillComponent } from "./components/skill/skill.component";
import { ExperienceComponent } from "./components/experience/experience.component";

const routes: Routes = [
  {
    path: "Config/certificate",
    component: CertificateComponent
  },
  {
    path: "Config/degree",
    component: DegreeeComponent
  },
  {
    path: "Config/skill",
    component: SkillComponent
  },
  {
    path: "Config/experience",
    component: ExperienceComponent
  },
  { path: "Config", redirectTo: "Config/certificate" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
