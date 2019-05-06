import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {RouterModule} from '@angular/router';
import {RoomComponent} from "./room.component";
import {RoomRoutingModule} from "./room-routing.module";
import {RoomIdentifier} from "../infrastructure/RoomIdentifier";
import {RoomService} from "../../infrastructure/service/RoomService";
import {MediaBoxComponent} from "./components/media-box/media-box.component";
import {ChatComponent} from "./components/chat/chat.component";
import {FormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        RoomRoutingModule,
        CommonModule,
        FormsModule,
    ],
    declarations: [
        RoomComponent,
        MediaBoxComponent,
        ChatComponent,
    ],
    bootstrap: [RoomComponent],
    providers: [
        {provide: RoomService, useClass: RoomService},
        {provide: RoomIdentifier, useClass: RoomIdentifier},
    ]
})
export class RoomModule { }
