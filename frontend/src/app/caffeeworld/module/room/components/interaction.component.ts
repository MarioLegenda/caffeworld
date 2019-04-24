import {Component, ElementRef, Host, Input, OnDestroy, ViewChild} from '@angular/core';
import SessionUpdatedEvent from "../../../infrastructure/event/SessionUpdatedEvent";
import PeerConnection from "../../infrastructure/PeerConnection";
import GetUserMedia from "../../infrastructure/GetUserMedia";
import IResponseData from "../../../infrastructure/web/IResponseData";
@Component({
    selector: 'app-interaction',
    templateUrl: './interaction.component.html',
    styleUrls: ['./interaction.component.scss'],
})
export class InteractionComponent {
    @ViewChild('video') video: ElementRef;

    @Input('onDestroy') onDestroy;
    @Input('onGetUserMediaCreated') onGetUserMediaCreated;

    constructor(
        private sessionUpdatedEvent: SessionUpdatedEvent,
    ) {
        this.sessionUpdatedEvent.onSessionUpdated((data: IResponseData) => {
            const peerConnection: PeerConnection = new PeerConnection(new RTCPeerConnection());
            const getUserMedia: GetUserMedia = new GetUserMedia({idealLow: true});

            peerConnection.onIceCandidate((event: RTCPeerConnectionIceEvent) => {
                console.log('onIceCandidate')
            });

            peerConnection.onNegotiationNeeded((event: RTCPeerConnectionIceEvent) => {
                console.log('onNegotiationNeeded');
            });

            peerConnection.onTrack((event: RTCTrackEvent) => {
                console.log('onTrack');
            });

            getUserMedia.onConnect((stream) => {
                this.video.nativeElement.volume = 0;
                this.video.nativeElement.muted = 0;

                this.video.nativeElement.srcObject = stream;
            }, this);
        });
    }
}
