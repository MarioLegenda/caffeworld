import {Component, OnInit} from '@angular/core';
import RoomEnteredEvent from "../../infrastructure/event/RoomEnteredEvent";
import SingletonSocketInstance from "../../infrastructure/socket/SingletonSocketInstance";
import RoomIdentifier from "../infrastructure/RoomIdentifier";
import SessionUpdatedEvent from "../../infrastructure/event/SessionUpdatedEvent";
import IResponseData from "../../infrastructure/web/IResponseData";

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {
    members = {};

    constructor(
        private roomEnteredEvent: RoomEnteredEvent,
        private roomIdentifier: RoomIdentifier,
        private socketInstance: SingletonSocketInstance,
        private sessionUpdateEvent: SessionUpdatedEvent
    ) {}

    ngOnInit(): void {
        this.keepConnAlive();

        this.socketInstance.socket.on('connect', () => {

            this.roomEnteredEvent.emitRoomEntered({
                identifier: this.roomIdentifier.roomIdentifier,
                memberIdentifier: this.socketInstance.socket.id,
            });

            this.sessionUpdateEvent.onSessionUpdated((responseData: IResponseData) => {
            });
        });

        this.socketInstance.socket.on('disconnect', () => {
            this.socketInstance.socket.open();
        })
    }

    private keepConnAlive() {
        setInterval(() => {
            this.socketInstance.socket.emit('ping');
        }, 10000);

        this.socketInstance.socket.on('pong', () => {});
    }
}
