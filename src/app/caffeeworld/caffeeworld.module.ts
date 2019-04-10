import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';

import { LandingComponent } from './landing/landing.component';
import { CaffeeworldComponent } from './caffeeworld.component';
import {CreateComponent} from './table/create/create.component';
import {RouterModule} from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        JwBootstrapSwitchNg2Module,
        RouterModule,
    ],
    declarations: [
        CaffeeworldComponent,
        LandingComponent,
        CreateComponent
    ]
})
export class CaffeeworldModule { }
