import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {RouterModule} from '@angular/router';
import {RoomComponent} from "./room.component";
import {RoomRoutingModule} from "./room-routing.module";
import {InteractionComponent} from "./components/interaction.component";
import RoomEnteredEvent from "../../infrastructure/event/RoomEnteredEvent";
import SessionUpdatedEvent from "../../infrastructure/event/SessionUpdatedEvent";
import SingletonSocketInstance from "../../infrastructure/socket/SingletonSocketInstance";
import {environment} from "../../../../environments/environment";
import RoomIdentifier from "../infrastructure/RoomIdentifier";

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        RoomRoutingModule,
    ],
    declarations: [
        RoomComponent,
        InteractionComponent
    ],
    bootstrap: [RoomComponent],
    providers: [
        RoomEnteredEvent,
        SessionUpdatedEvent,
        RoomIdentifier,
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
