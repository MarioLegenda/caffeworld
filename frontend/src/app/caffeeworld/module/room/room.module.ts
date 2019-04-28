import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {RouterModule} from '@angular/router';
import {RoomComponent} from "./room.component";
import {RoomRoutingModule} from "./room-routing.module";
import {MemberBoxComponent} from "./components/member-box.component";
import SessionUpdatedEvent from "../../infrastructure/event/SessionUpdatedEvent";
import RoomIdentifier from "../infrastructure/RoomIdentifier";
import IceAnswerEvent from "../../infrastructure/event/IceAnswerEvent";
import IceCandidateEvent from "../../infrastructure/event/IceCandidateEvent";
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
        SessionUpdatedEvent,
        IceAnswerEvent,
        RoomIdentifier,
        IceCandidateEvent,
    ]
})
export class RoomModule { }
