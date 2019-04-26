import {Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import PeerConnection from "../../infrastructure/PeerConnection";
import GetUserMedia from "../../infrastructure/GetUserMedia";

@Component({
    selector: 'app-member-box',
    templateUrl: './member-box.component.html',
    styleUrls: ['./member-box.component.scss'],
})
export class MemberBoxComponent implements OnDestroy {
    @ViewChild('video') video: ElementRef;

    @Input('memberIdentifier') memberIdentifier: string;
    @Input('onDestroy') onDestroy;
    @Input('onGetUserMediaCreated') onGetUserMediaCreated;

    private getUserMedia: GetUserMedia;
    private peerConnection: PeerConnection;

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

        this.getUserMedia = getUserMedia;
        this.peerConnection = peerConnection;
    }

    ngOnDestroy(): void {
        this.getUserMedia.destroy();
        this.peerConnection.destroy();
        this.video.nativeElement.srcObject = null;
        this.video.nativeElement = null;
    }
}
