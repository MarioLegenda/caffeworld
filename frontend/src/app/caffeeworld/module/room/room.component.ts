import {Component, OnInit} from '@angular/core';
import RoomEnteredEvent from "../../infrastructure/event/RoomEnteredEvent";
import {Router} from "@angular/router";

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {
    constructor(
        private roomEnteredEvent: RoomEnteredEvent,
        private router: Router
    ) {}

    ngOnInit(): void {
        const url: string = this.router.url;
        const identifier: string = url.split('/')[2];

        this.roomEnteredEvent.emitRoomEntered(identifier);
    }
}
