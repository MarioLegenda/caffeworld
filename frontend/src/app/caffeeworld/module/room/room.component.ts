import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import RoomEnteredEvent from "../../infrastructure/event/RoomEnteredEvent";
import SingletonSocketInstance from "../../infrastructure/socket/SingletonSocketInstance";
import RoomIdentifier from "../infrastructure/RoomIdentifier";
import SessionUpdatedEvent from "../../infrastructure/event/SessionUpdatedEvent";
import IResponseData from "../../infrastructure/web/IResponseData";
import {ReplaySubject, Subject} from "rxjs";
import IceAnswerEvent from "../../infrastructure/event/IceAnswerEvent";
import IceCandidateEvent from "../../infrastructure/event/IceCandidateEvent";
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
        private socketInstance: SingletonSocketInstance,
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

        this.socketInstance.socket.emit('app.server.ice.offer_created', offer);
    }

    onIceCandidate(event) {
        event.roomIdentifier = this.roomIdentifier.roomIdentifier;

        this.socketInstance.socket.emit('app.server.ice.candidate', event);
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
        this.socketInstance.socket.on('disconnect', () => {
            this.socketInstance.socket.open();
        });
    }

    private handleAnswer() {
        this.iceAnswerEvent.onIceAnswer((data) => {
            this.iceAnswer.next(data);
        });
    }

    private handleIceCandidate() {
        this.socketInstance.socket.on('app.client.ice.candidate', (data) => {
            this.iceCandidate.next(data);
        })
    }

    private keepConnAlive() {
        setInterval(() => {
            this.socketInstance.socket.emit('ping');
        }, 10000);

        this.socketInstance.socket.on('pong', () => {});
    }
}
