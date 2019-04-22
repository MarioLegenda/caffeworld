import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {RouterModule} from '@angular/router';
import {RoomComponent} from "./room.component";
import {RoomRoutingModule} from "./room-routing.module";
import {InteractionComponent} from "./components/interaction.component";
import GetUserMedia from "../infrastructure/GetUserMedia";
import PeerConnection from "../infrastructure/PeerConnection";

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
        {
            provide: GetUserMedia,
            useFactory: () => {
                return new GetUserMedia({idealLow: true});
            }
        },
        {provide: PeerConnection, useClass: PeerConnection}
    ]
})
export class RoomModule { }
