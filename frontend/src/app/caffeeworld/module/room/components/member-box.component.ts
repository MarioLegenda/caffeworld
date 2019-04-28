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

    private getUserMedia: GetUserMediaProxy;
    private peerConnection: PeerConnectionProxy;

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

        // chrome workaround because chrome calles negotiation twice, once for every track added
        // in the handleUserMedia method
        let offerCreated = false;
        this.sessionUpdated.subscribe(() => {
            this.peerConnection.onNegotiationNeeded((event: RTCPeerConnectionIceEvent) => {
                if (!offerCreated) {
                    offerCreated = true;
                    this.peerConnection.createOffer()
                        .then((offer: any) => {
                            this.peerConnection.setLocalDescription(offer);
                            this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

                            this.onCreateOffer.emit({
                                desc: offer,
                                memberIdentifier: this.memberIdentifier,
                            });
                        })
                        .catch((err) => console.log(err.message));
                }
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
                }
            }
        })
    }

    handleIceCandidate() {
        this.iceCandidate.subscribe((data: any) => {
            if (data.candidate) {
                console.log(data);
                this.peerConnection.addIceCandidate(data.candidate);
            }
        });
    }
}
