import {Component, ElementRef, OnInit} from '@angular/core';
import AppSocket from "../../infrastructure/AppSocket";
import {Router} from "@angular/router";

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit{
    constructor(
        private socket: AppSocket,
        private router: Router
    ) {}

    ngOnInit(): void {
        const url: string = this.router.url;
        const identifier: string = url.split('/')[2];

        this.socket.emit('app.events.room.entered', identifier);
    }
}
