import {Component, OnDestroy, OnInit} from '@angular/core';
import RoomIdentifier from "../infrastructure/RoomIdentifier";
import IResponseData from "../../infrastructure/web/IResponseData";
import {ReplaySubject} from "rxjs";
import RoomService from "../../infrastructure/service/RoomService";
import Socket from "../../infrastructure/socket/Socket";
import IInput from "../../infrastructure/event/IInput";
import Input from "../../infrastructure/event/Input";

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit, OnDestroy {
    members = {};

    private readonly input: IInput;

    private readonly sessionUpdated: ReplaySubject<any> = new ReplaySubject();
    private readonly iceOffer: ReplaySubject<any> = new ReplaySubject();
    private readonly iceCandidate: ReplaySubject<any> = new ReplaySubject();

    constructor(
        input: Input,
        private roomIdentifier: RoomIdentifier,
        private roomService: RoomService,
    ) {
        this.input = input as IInput;
    }

    fnTrackBy(index, item) {
        return item.value;
    }

    ngOnInit(): void {
        this.keepConnAlive();
        this.handleConnection();
        this.handleDisconnection();
        this.handleIceOffer();
        this.handleIceCandidate();
    }

    onCreateOffer(offer: any) {
        offer.roomIdentifier = this.roomIdentifier.roomIdentifier;

        Socket.room.emit('app.server.ice.offer_created', offer);
    }

    onIceCandidate(event) {
        event.roomIdentifier = this.roomIdentifier.roomIdentifier;

        Socket.room.emit('app.server.ice.candidate', event);
    }

    ngOnDestroy(): void {
        this.members = {};
    }

    private handleConnection() {
        Socket.room.on('connect', () => {
            this.roomService.handleEnteringRoom();

            this.roomService.roomUpdated((responseData: IResponseData) => {
                if (Object.keys(this.members).length >= 1) {
                    this.sessionUpdated.next();
                }

                // @ts-ignore
                const members = responseData.body.room.members;

                // @ts-ignore
                for (const member of members.list) {
                    if (member in this.members === false) this.members[member] = member;
                }
            });

            this.roomService.roomLeave((responseData: IResponseData) => {
                // @ts-ignore
                const members = responseData.body.room.members;

                // if one of members are not present in this.member, remove it from this.member
                // @ts-ignore
                for (const member of Object.values(this.members)) {
                    if (!members.list.includes(member)) delete this.members[member];
                }
            })
        });
    }

    private handleDisconnection() {
        Socket.room.on('disconnect', () => {
            Socket.room.open();
        });
    }

    private handleIceOffer() {
        this.input.onIceOffer((data) => {
            this.iceOffer.next(data);
        });
    }

    private handleIceCandidate() {
        this.input.onAddIceCandidate((data) => {
            this.iceCandidate.next(data);
        });
    }

    private keepConnAlive() {
        setInterval(() => {
            Socket.room.emit('ping');
        }, 10000);

        Socket.room.on('pong', () => {});
    }
}
