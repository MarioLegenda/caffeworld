import {Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import GetUserMedia from "../../infrastructure/GetUserMedia";
import PeerConnection from "../../infrastructure/PeerConnection";
import AppSocket from "../../../infrastructure/AppSocket";
import SingletonSocketInstance from "../../../infrastructure/socket/SingletonSocketInstance";
import IObservableFactory from "../../../infrastructure/observableFactory/IObservableFactory";
import SingleEventObservableFactory from "../../../infrastructure/observableFactory/SingleEventObservableFactory";

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
        {
            provide: SingleEventObservableFactory,
            useFactory: () => new SingleEventObservableFactory()
        },
        PeerConnection,
        {
            provide: AppSocket,
            useFactory: (socketInstance: SingletonSocketInstance, observableFactory: IObservableFactory) => {
                return new AppSocket(
                    socketInstance,
                    observableFactory
                );
            },
            deps: [SingletonSocketInstance, SingleEventObservableFactory]
        }
    ]
})
export class InteractionComponent implements OnDestroy {
    @ViewChild('video') video: ElementRef;

    @Input('onDestroy') onDestroy;
    @Input('onGetUserMediaCreated') onGetUserMediaCreated;

    private interactionInit: boolean = false;

    constructor(
        private getUserMedia: GetUserMedia,
        private peerConnection: PeerConnection,
        private socket: AppSocket
    ) {
        this.socket.observe('app.events.room.session_updated').subscribe((event) => {
            // a flag to tell us that the session is established and that we can
            // create the peer connection
            this.interactionInit = true;

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
                this.video.nativeElement.volume = 0;
                this.video.nativeElement.muted = 0;

                this.video.nativeElement.srcObject = stream;
            });
        });
    }

    ngOnDestroy(): void {
        if (this.interactionInit) {
            if (this.onDestroy && this.onDestroy instanceof Function) {
                this.onDestroy.call(null, ...[this.getUserMedia, this.video])
            }

            this.getUserMedia.destroy();
            this.getUserMedia = null;
            this.video.nativeElement.srcObject = null;
            this.video.nativeElement.remove();
        }
    }

    private eventSubscriber() {

    }
}
