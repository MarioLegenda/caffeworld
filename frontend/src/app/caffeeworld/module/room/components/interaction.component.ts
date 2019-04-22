import {AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import GetUserMedia from "../../infrastructure/GetUserMedia";
import PeerConnection from "../../infrastructure/PeerConnection";
import AppSocket from "../../../infrastructure/AppSocket";

@Component({
    selector: 'app-interaction',
    templateUrl: './interaction.component.html',
    styleUrls: ['./interaction.component.scss'],
    providers: [
        {
            provide: GetUserMedia,
            useFactory: () => {
                return new GetUserMedia({idealLow: true});
            }
        },
        {provide: PeerConnection, useClass: PeerConnection}
    ]
})
export class InteractionComponent implements AfterViewInit, OnDestroy {
    @ViewChild('video') video: ElementRef;

    @Input('onDestroy') onDestroy;
    @Input('onGetUserMediaCreated') onGetUserMediaCreated;

    constructor(
        private getUserMedia: GetUserMedia,
        private peerConnection: PeerConnection
    ) {}

    ngAfterViewInit() {
        this.peerConnection.create();

        this.peerConnection.onIceCandidate((event: RTCPeerConnectionIceEvent) => {
            console.log('onIceCandidate')
        });

        this.peerConnection.onNegotiationNeeded((event: RTCPeerConnectionIceEvent) => {
            console.log('onNegotiationNeeded');
        });

        this.peerConnection.onTrack((event: RTCTrackEvent) => {
            console.log('onTrack');
        });

        this.getUserMedia.subscribe((stream) => {
            if (this.onGetUserMediaCreated && this.onGetUserMediaCreated instanceof Function) {
                this.onGetUserMediaCreated.call(null, ...[stream]);

                return;
            }

            this.video.nativeElement.volume = 0;
            this.video.nativeElement.muted = 0;

            this.video.nativeElement.srcObject = stream;
        });
    }

    ngOnDestroy(): void {
        if (this.onDestroy && this.onDestroy instanceof Function) {
            this.onDestroy.call(null, ...[this.getUserMedia, this.video])
        }

        this.getUserMedia.destroy();
        this.getUserMedia = null;
        this.video.nativeElement.srcObject = null;
        this.video.nativeElement.remove();
    }
}
