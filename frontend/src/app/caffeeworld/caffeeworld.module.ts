import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';

import { LandingComponent } from './landing/landing.component';
import { CaffeeworldComponent } from './caffeeworld.component';
import {CreateComponent} from './table/create/create.component';
import {RouterModule} from '@angular/router';
import InvitationService from './table/create/service/InvitationService';
import {BrowserModule} from '@angular/platform-browser';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {AboutComponent} from './about/about.component';
import {TableSocketService} from "./infrastructure/TableSocketService";
import AppSocket from "./infrastructure/AppSocket";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        BrowserModule,
        NgbModule,
        JwBootstrapSwitchNg2Module,
        RouterModule,
    ],
    declarations: [
        CaffeeworldComponent,
        LandingComponent,
        CreateComponent,
        PageNotFoundComponent,
        AboutComponent
    ],
    providers: [
        {
            provide: InvitationService,
            useFactory: () => new InvitationService(5),
        },
        {
            provide: AppSocket,
            useFactory: () => AppSocket.create('http://11.11.11.12/', {}),
        },
        {provide: TableSocketService, useClass: TableSocketService}
    ]
})
export class CaffeeworldModule { }
