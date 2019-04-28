import {Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild} from '@angular/core';
import PeerConnectionProxy from "../../infrastructure/WebRTC/PeerConnectionProxy";
import GetUserMediaProxy from "../../infrastructure/WebRTC/GetUserMediaProxy";
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
    @Input('sessionUpdated') sessionUpdated: Observable<void>;
    @Input('iceCandidate') iceCandidate: Observable<void>;

    @Output() onCreateOffer = new EventEmitter<object>();
    @Output() onIceCandidate = new EventEmitter<object>();

    private readonly getUserMedia: GetUserMediaProxy;
    private readonly peerConnection: PeerConnectionProxy;

    constructor() {
        const configuration = {
            iceServers: [{
                urls: 'stun:numb.viagenie.ca'
            }],
        };

        this.peerConnection = PeerConnectionProxy.create(configuration);
        this.getUserMedia = GetUserMediaProxy.create();
    }

    ngOnInit() {
        this.handleGetUserMedia();
        this.handlePeerConnection();
        this.handleIceAnswer();
        this.handleIceCandidate();
    }

    ngOnDestroy(): void {
        this.getUserMedia.destroy();
        this.peerConnection.destroy();
        this.video.nativeElement.srcObject = null;
        this.video.nativeElement = null;
    }

    private handleGetUserMedia() {
        this.getUserMedia.connect(this.peerConnection, this.video.nativeElement);
    }

    private handlePeerConnection() {
        this.peerConnection.onIceCandidate((event: RTCPeerConnectionIceEvent) => {
            this.onIceCandidate.emit({candidate: event.candidate});
        });

        this.peerConnection.onTrack((event: RTCTrackEvent) => {
            console.log('onTrackEvent');
            console.log(event);
        });

        this.sessionUpdated.subscribe(() => {
            this.peerConnection.onNegotiationNeeded((offer: any) => {
                this.onCreateOffer.emit({
                    desc: offer,
                    memberIdentifier: this.memberIdentifier,
                });
            });
        });

        this.peerConnection.onTrack((event: RTCTrackEvent) => {
            console.log('onTrack');
        });
    }

    handleIceAnswer() {
        let isAlreadySet = false;
        this.iceAnswer.subscribe((data: any) => {
            if (!isAlreadySet) {
                isAlreadySet = true;

                if (data.type === 'offer') {
                    this.peerConnection.setRemoteDescription(data.desc);
                }
            }
        })
    }

    handleIceCandidate() {
        this.iceCandidate.subscribe((data: any) => {
            console.log(data);
            if (data.candidate) {
                this.peerConnection.addIceCandidate(data.candidate);
            }
        });
    }
}
