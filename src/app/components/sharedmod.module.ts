import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { PNPrimeModule } from 'src/app/shared/pnprime/pnprime.module'
import { MaterialModule } from 'src/app/shared/material.module';
import { SearchPipe } from 'src/app/shared/pipe-filters/pipe-search';

import { ConfigAddressComponent } from './config-address/config-address.component';
import { ConfigContactComponent } from './config-contact/config-contact.component';
import { ConfigSocialMediaComponent } from './config-social-media/config-social-media.component';

@NgModule({
    declarations: [
        ConfigAddressComponent,
        ConfigContactComponent,
        ConfigSocialMediaComponent,
        SearchPipe
    ],
    imports: [
        CommonModule,
        FormsModule,
        PNPrimeModule,
        MaterialModule
    ],
    exports: [
        ConfigAddressComponent,
        ConfigContactComponent,
        ConfigSocialMediaComponent
    ]
})
export class SharedmodModule { }
