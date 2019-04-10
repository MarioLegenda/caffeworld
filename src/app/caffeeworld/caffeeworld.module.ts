import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';

import { LandingComponent } from './landing/landing.component';
import { CaffeeworldComponent } from './caffeeworld.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        JwBootstrapSwitchNg2Module,
    ],
    declarations: [
        CaffeeworldComponent,
        LandingComponent,
    ]
})
export class CaffeeworldModule { }
