import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {RouterModule} from '@angular/router';
import {RoomComponent} from "./room.component";
import {RoomRoutingModule} from "./room-routing.module";
import {MemberBoxComponent} from "./components/member-box.component";
import RoomEnteredEvent from "../../infrastructure/event/RoomEnteredEvent";
import SessionUpdatedEvent from "../../infrastructure/event/SessionUpdatedEvent";
import SingletonSocketInstance from "../../infrastructure/socket/SingletonSocketInstance";
import {environment} from "../../../../environments/environment";
import RoomIdentifier from "../infrastructure/RoomIdentifier";
import IceAnswerEvent from "../../infrastructure/event/IceAnswerEvent";
import IceCandidateEvent from "../../infrastructure/event/IceCandidateEvent";

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
        RoomEnteredEvent,
        SessionUpdatedEvent,
        IceAnswerEvent,
        RoomIdentifier,
        IceCandidateEvent,
        {
            provide: SingletonSocketInstance,
            useFactory: () => new SingletonSocketInstance(
                environment.siteUrl + '/room',
                {path: '/socket', reconnectionAttempts: 5},
            ),
        },
    ]
})
export class RoomModule { }
