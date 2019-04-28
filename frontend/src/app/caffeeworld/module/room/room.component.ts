import {Component, OnDestroy, OnInit} from '@angular/core';
import RoomEnteredEvent from "../../infrastructure/event/RoomEnteredEvent";
import RoomIdentifier from "../infrastructure/RoomIdentifier";
import SessionUpdatedEvent from "../../infrastructure/event/SessionUpdatedEvent";
import IResponseData from "../../infrastructure/web/IResponseData";
import {ReplaySubject} from "rxjs";
import IceAnswerEvent from "../../infrastructure/event/IceAnswerEvent";
import RoomService from "../../infrastructure/service/RoomService";
import Socket from "../../infrastructure/socket/Socket";

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit, OnDestroy {
    members = {};

    private readonly sessionUpdated: ReplaySubject<any> = new ReplaySubject();
    private readonly iceAnswer: ReplaySubject<any> = new ReplaySubject();
    private readonly iceCandidate: ReplaySubject<any> = new ReplaySubject();

    constructor(
        private roomEnteredEvent: RoomEnteredEvent,
        private iceAnswerEvent: IceAnswerEvent,
        private roomIdentifier: RoomIdentifier,
        private sessionUpdateEvent: SessionUpdatedEvent,
        private roomService: RoomService,
    ) {}

    fnTrackBy(index, item) {
        return item.value;
    }

    ngOnInit(): void {
        this.keepConnAlive();
        this.handleConnection();
        this.handleDisconnection();
        this.handleAnswer();
        this.handleIceCandidate();
    }

    onCreateOffer(offer: any) {
        offer.roomIdentifier = this.roomIdentifier.roomIdentifier;

        Socket.room.emit('app.server.ice.offer_created', offer);
    }

    onIceCandidate(event) {
        event.roomIdentifier = this.roomIdentifier.roomIdentifier;

        Socket.room.socket.emit('app.server.ice.candidate', event);
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

                console.log(members);

                // @ts-ignore
                for (const member of members.list) {
                    if (member in this.members === false) this.members[member] = member;
                }
            });

            this.sessionUpdateEvent.onSessionDisconnect((responseData: IResponseData) => {
                // @ts-ignore
                const members = responseData.body.room.members;

                console.log(members);
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

    private handleAnswer() {
        this.iceAnswerEvent.onIceAnswer((data) => {
            this.iceAnswer.next(data);
        });
    }

    private handleIceCandidate() {
        Socket.room.on('app.client.ice.candidate', (data) => {
            this.iceCandidate.next(data);
        })
    }

    private keepConnAlive() {
        setInterval(() => {
            Socket.room.emit('ping');
        }, 10000);

        Socket.room.on('pong', () => {});
    }
}
