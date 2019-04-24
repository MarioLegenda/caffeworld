import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {RouterModule} from '@angular/router';
import {RoomComponent} from "./room.component";
import {RoomRoutingModule} from "./room-routing.module";
import {InteractionComponent} from "./components/interaction.component";
import GetUserMedia from "../infrastructure/GetUserMedia";
import PeerConnection from "../infrastructure/PeerConnection";
import AppSocket from "../../infrastructure/AppSocket";
import SingletonSocketInstance from "../../infrastructure/socket/SingletonSocketInstance";
import IObservableFactory from "../../infrastructure/observableFactory/IObservableFactory";
import SingleEventObservableFactory from "../../infrastructure/observableFactory/SingleEventObservableFactory";

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
            provide: AppSocket,
            useFactory: (socketInstance: SingletonSocketInstance, observableFactory: IObservableFactory) => {
                return new AppSocket(
                    socketInstance,
                    observableFactory
                );
            },
            deps: [SingletonSocketInstance, SingleEventObservableFactory]
        },
        {
            provide: GetUserMedia,
            useFactory: () => {
                return new GetUserMedia({idealLow: true});
            }
        },
        PeerConnection
    ]
})
export class RoomModule { }
