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
import OnceObservableFactory from "./infrastructure/observableFactory/OnceObservableFactory";

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
        OnceObservableFactory,
        {
            provide: TableSocketService,
            useFactory: (socketInstance: SingletonSocketInstance, observableFactory: IObservableFactory) => {
                return new TableSocketService(
                    new AppSocket(socketInstance, observableFactory),
                );
            },
            deps: [SingletonSocketInstance, OnceObservableFactory]
        }
    ]
})
export class CaffeeworldModule { }
