import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {RouterModule} from '@angular/router';
import {RoomComponent} from "./room.component";
import {RoomRoutingModule} from "./room-routing.module";
import {MemberBoxComponent} from "./components/member-box.component";
import RoomIdentifier from "../infrastructure/RoomIdentifier";
import RoomService from "../../infrastructure/service/RoomService";

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        RoomRoutingModule,
    ],
    declarations: [
        RoomComponent,
        MemberBoxComponent
    ],
    bootstrap: [RoomComponent],
    providers: [
        RoomService,
        RoomIdentifier,
    ]
})
export class RoomModule { }
