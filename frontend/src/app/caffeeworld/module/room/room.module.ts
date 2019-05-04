import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {RouterModule} from '@angular/router';
import {RoomComponent} from "./room.component";
import {RoomRoutingModule} from "./room-routing.module";
import RoomIdentifier from "../infrastructure/RoomIdentifier";
import RoomService from "../../infrastructure/service/RoomService";
import {MediaBoxComponent} from "./components/media-box/media-box.component";
import {ChatComponent} from "./components/chat/chat.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        RoomRoutingModule,
    ],
    declarations: [
        RoomComponent,
        MediaBoxComponent,
        ChatComponent,
    ],
    bootstrap: [RoomComponent],
    providers: [
        RoomService,
        RoomIdentifier,
    ]
})
export class RoomModule { }
