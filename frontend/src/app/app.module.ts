import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import {CaffeeworldModule} from './caffeeworld/caffeeworld.module';
import ObservableFactory from "./caffeeworld/infrastructure/ObservableFactory";
import AppSocket from "./caffeeworld/infrastructure/AppSocket";
import {environment} from "../environments/environment";

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent
    ],
    imports: [
        BrowserAnimationsModule,
        NgbModule.forRoot(),
        FormsModule,
        RouterModule,
        AppRoutingModule,
        ComponentsModule,
        CaffeeworldModule
    ],
    providers: [
        {
            provide: AppSocket,
            useFactory: (observableFactory: ObservableFactory) => new AppSocket(
                environment.siteUrl + '/',
                {path: '/socket', reconnectionAttempts: 5},
                observableFactory
            ),
            deps: [ObservableFactory]
        },
        {provide: ObservableFactory, useClass: ObservableFactory}
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
