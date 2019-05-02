import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {RouterModule} from '@angular/router';
import {RoomComponent} from "./room.component";
import {RoomRoutingModule} from "./room-routing.module";
import RoomIdentifier from "../infrastructure/RoomIdentifier";
import RoomService from "../../infrastructure/service/RoomService";
import {LocalMemberBoxComponent} from "./components/localMediaStream/local-member-box.component";
import {RemoteMemberBoxComponent} from "./components/remoteMediaStream/remote-member-box.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        RoomRoutingModule,
    ],
    declarations: [
        RoomComponent,
        LocalMemberBoxComponent,
        RemoteMemberBoxComponent,
    ],
    bootstrap: [RoomComponent],
    providers: [
        RoomService,
        RoomIdentifier,
    ]
})
export class RoomModule { }
