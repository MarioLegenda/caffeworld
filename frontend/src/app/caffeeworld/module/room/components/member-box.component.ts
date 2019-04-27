import {Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild} from '@angular/core';
import PeerConnectionProxy from "../../infrastructure/WebRTC/PeerConnectionProxy";
import GetUserMedia from "../../infrastructure/WebRTC/GetUserMedia";
import {Observable} from "rxjs";

@Component({
    selector: 'app-member-box',
    templateUrl: './member-box.component.html',
    styleUrls: ['./member-box.component.scss'],
})
export class MemberBoxComponent implements OnDestroy {
    @ViewChild('video') video: ElementRef;

    @Input('memberIdentifier') memberIdentifier: string;
    @Input('iceAnswer') iceAnswer: Observable<void>;

    @Output() onCreateOffer = new EventEmitter<object>();

    private getUserMedia: GetUserMedia;
    private peerConnection: PeerConnectionProxy;

    constructor() {
        const configuration = {
            iceServers: [{
                urls: 'stun:numb.viagenie.ca'
            }],
        };

        this.peerConnection = PeerConnectionProxy.create(configuration);
        this.getUserMedia = GetUserMedia.create();
    }

    ngOnInit() {
        this.handleGetUserMedia();
        this.handlePeerConnection();
    }

    ngOnDestroy(): void {
        this.getUserMedia.destroy();
        this.peerConnection.destroy();
        this.video.nativeElement.srcObject = null;
        this.video.nativeElement = null;
    }

    private handleGetUserMedia() {
        this.getUserMedia.onConnect((stream) => {
            this.video.nativeElement.volume = 0;
            this.video.nativeElement.muted = 0;

            this.video.nativeElement.srcObject = stream;

            stream.getTracks().forEach(track => this.peerConnection.rtcPeerConnection.addTrack(track, stream));

        }, this);
    }

    private handlePeerConnection() {
        this.peerConnection.onIceCandidate((event: RTCPeerConnectionIceEvent) => {
            console.log('onIceCandidate')
        });

        this.peerConnection.onTrack((event: RTCTrackEvent) => {
            console.log('onTrackEvent');
            console.log(event);
        });

        this.iceAnswer.subscribe(() => {
            this.peerConnection.onNegotiationNeeded((event: RTCPeerConnectionIceEvent) => {
                this.peerConnection.createOffer().then((event: RTCSessionDescription) => {
                    this.onCreateOffer.emit({
                        type: event.type,
                        memberIdentifier: this.memberIdentifier,
                    });
                }).catch((err) => console.log(err.message));
            });
        });

        this.peerConnection.onTrack((event: RTCTrackEvent) => {
            console.log('onTrack');
        });
    }
}
