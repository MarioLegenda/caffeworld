import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { LandingComponent } from './caffeeworld/landing/landing.component';
import {CreateComponent} from './caffeeworld/table/create/create.component';

const routes: Routes =[
    { path: '',     component: LandingComponent },
    {path: 'table/create', component: CreateComponent },
];

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule.forRoot(routes)
    ],
    exports: [
    ],
})
export class AppRoutingModule { }
