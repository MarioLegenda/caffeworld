import {Component, OnInit} from '@angular/core';
import RoomEnteredEvent from "../../infrastructure/event/RoomEnteredEvent";
import {Router} from "@angular/router";
import SingletonSocketInstance from "../../infrastructure/socket/SingletonSocketInstance";
import RoomIdentifier from "../infrastructure/RoomIdentifier";

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {
    constructor(
        private roomEnteredEvent: RoomEnteredEvent,
        private roomIdentifier: RoomIdentifier,
        private socketInstance: SingletonSocketInstance
    ) {}

    ngOnInit(): void {
        this.roomEnteredEvent.emitRoomEntered(this.roomIdentifier.roomIdentifier);

        setTimeout(() => {
            this.socketInstance.socket.emit('ping');
        }, 10000);

        this.socketInstance.socket.on('pong', () => {});
    }
}
