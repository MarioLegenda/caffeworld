import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { LandingComponent } from './caffeeworld/landing/landing.component';
import {CreateComponent} from './caffeeworld/table/create/create.component';
import {PageNotFoundComponent} from './caffeeworld/page-not-found/page-not-found.component';
import {AboutComponent} from './caffeeworld/about/about.component';

const routes: Routes =[
    { path: '',     component: LandingComponent },
    {path: 'table/create', component: CreateComponent },
    {path: 'about', component: AboutComponent },
    {path: '**', component: PageNotFoundComponent },
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
