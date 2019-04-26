import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
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
export class RoomComponent implements OnInit, OnDestroy {
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
                // @ts-ignore
                const members = responseData.body.room.members;

                // if one of members are not present in this.member, remove it from this.member
                // @ts-ignore
                for (const member of Object.values(this.members)) {
                    if (member in members === false) delete this.members[member];
                }

                (function(currentMembers, templateMembers) {
                    setTimeout(() => {
                        // @ts-ignore
                        for (const member of Object.values(currentMembers)) {
                            if (member in templateMembers === false) templateMembers[member] = member;
                        }
                    }, 1000);
                })(members, this.members);
            });
        });

        this.socketInstance.socket.on('disconnect', () => {
            this.socketInstance.socket.open();
        });
    }

    ngOnDestroy(): void {
        this.members = {};
    }

    private keepConnAlive() {
        setInterval(() => {
            this.socketInstance.socket.emit('ping');
        }, 10000);

        this.socketInstance.socket.on('pong', () => {});
    }
}
