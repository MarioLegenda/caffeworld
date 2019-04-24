import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';

import { LandingComponent } from './landing/landing.component';
import { CaffeeworldComponent } from './caffeeworld.component';
import {CreateComponent} from './table/create/create.component';
import {RouterModule} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {AboutComponent} from './about/about.component';
import {TableSocketService} from "./infrastructure/TableSocketService";
import { ClipboardModule } from 'ngx-clipboard';
import SingletonSocketInstance from "./infrastructure/socket/SingletonSocketInstance";
import AppSocket from "./infrastructure/AppSocket";
import IObservableFactory from "./infrastructure/observableFactory/IObservableFactory";
import SingleEventObservableFactory from "./infrastructure/observableFactory/SingleEventObservableFactory";
import MultiEventObservableFactory from "./infrastructure/observableFactory/MultiEventObservableFactory";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        BrowserModule,
        NgbModule,
        JwBootstrapSwitchNg2Module,
        RouterModule,
        ClipboardModule,
    ],
    declarations: [
        CaffeeworldComponent,
        LandingComponent,
        CreateComponent,
        PageNotFoundComponent,
        AboutComponent,
    ],
    exports: [CaffeeworldComponent],
    providers: [
        SingleEventObservableFactory,
        MultiEventObservableFactory,
        TableSocketService,
        {
            provide: AppSocket,
            useFactory: (socketInstance: SingletonSocketInstance, observableFactory: IObservableFactory) => new AppSocket(socketInstance, observableFactory),
            deps: [SingletonSocketInstance, SingleEventObservableFactory]
        }
    ]
})
export class CaffeeworldModule { }
