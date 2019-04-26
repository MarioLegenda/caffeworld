import {Component, ElementRef, Host, Input, OnDestroy, ViewChild} from '@angular/core';
import SessionUpdatedEvent from "../../../infrastructure/event/SessionUpdatedEvent";
import PeerConnection from "../../infrastructure/PeerConnection";
import GetUserMedia from "../../infrastructure/GetUserMedia";
import IResponseData from "../../../infrastructure/web/IResponseData";

@Component({
    selector: 'app-member-box',
    templateUrl: './member-box.component.html',
    styleUrls: ['./member-box.component.scss'],
})
export class MemberBoxComponent {
    @ViewChild('video') video: ElementRef;

    @Input('memberIdentifier') memberIdentifier: string;
    @Input('onDestroy') onDestroy;
    @Input('onGetUserMediaCreated') onGetUserMediaCreated;

    ngOnInit() {
        const configuration = {
            iceServers: [{
                urls: 'stun:stun.voiparound.com'
            }]
        };

        const peerConnection: PeerConnection = new PeerConnection(new RTCPeerConnection(configuration));
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

            stream.getTracks().forEach(track => peerConnection.rtcPeerConnection.addTrack(track, stream));

        }, this);
    }
}
