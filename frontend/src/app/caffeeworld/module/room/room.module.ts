import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {RouterModule} from '@angular/router';
import {RoomComponent} from "./room.component";
import {RoomRoutingModule} from "./room-routing.module";
import {InteractionComponent} from "./components/interaction.component";
import RoomEnteredEvent from "../../infrastructure/event/RoomEnteredEvent";
import SessionUpdatedEvent from "../../infrastructure/event/SessionUpdatedEvent";
import {CreateTableEvent} from "../../infrastructure/event/CreateTableEvent";

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
    ]
})
export class RoomModule { }
