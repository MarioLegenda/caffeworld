import {AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import PeerConnectionProxy from "../../../infrastructure/WebRTC/PeerConnectionProxy";
import GetUserMediaProxy from "../../../infrastructure/WebRTC/GetUserMediaProxy";
import Output from "../../../../infrastructure/event/Output";
import {Input as DataInput} from "../../../../infrastructure/event/Input";
import IInput from "../../../../infrastructure/event/IInput";
import IOutput from "../../../../infrastructure/event/IOutput";
import IResponseData from "../../../../infrastructure/web/IResponseData";
import RoomIdentifier from "../../../infrastructure/RoomIdentifier";
import Socket from "../../../../infrastructure/socket/Socket";

@Component({
    selector: 'app-remote-member-box',
    templateUrl: './member-box.component.html',
    styleUrls: ['./member-box.component.scss'],
})
export class RemoteMemberBoxComponent implements OnDestroy {
    @ViewChild('media') media: ElementRef;

    @Input('memberIdentifier') memberIdentifier: string;
    @Input('newMember') newMember: string;
    @Input('isLocal') isLocal: string;

    private readonly getUserMedia: GetUserMediaProxy;
    private readonly remotePeerConnection: PeerConnectionProxy;

    private remoteUserMedia;

    private readonly input: IInput;
    private readonly output: IOutput;
    private readonly roomIdentifier: RoomIdentifier;

    private savedOffer;

    constructor(
        output: Output,
        input: DataInput,
        roomIdentifier: RoomIdentifier,
    ) {
        const configuration = {
            iceServers: [{
                urls: 'stun:numb.viagenie.ca'
            }],
        };

        this.roomIdentifier = roomIdentifier;
        this.output = output as IOutput;
        this.input = input as IInput;

        this.remotePeerConnection = PeerConnectionProxy.create(configuration);
        this.remoteUserMedia = GetUserMediaProxy.create();
    }

    async ngOnInit() {
        await this.handleUserMedia();

        this.handlePeerConnectionEvents();

    }

    ngOnDestroy(): void {
        this.getUserMedia.destroy();
    }

    async handleUserMedia() {
        await this.remoteUserMedia.connect();
        this.remotePeerConnection.addTracks(this.remoteUserMedia.mediaStream);

        console.log(`Created local getUserMedia objects and added tracks for it`);

        this.media.nativeElement.muted = true;
    }

    private handlePeerConnectionEvents() {
        if (!this.isLocal) {
            console.log(`${this.memberIdentifier} sending an offer`);
            this.remotePeerConnection.createOffer().then( (offer: RTCSessionDescription) => {
            console.log(`${this.memberIdentifier} created an offer and sent it`);

                this.savedOffer = offer;

                console.log(`${this.memberIdentifier} sending data_exchange event to the signaling server with the offer`);

                this.output.sendDataExchange({
                    type: 'offer',
                    data: offer,
                    roomIdentifier: this.roomIdentifier.roomIdentifier,
                    fromMember: this.memberIdentifier,
                });
            });
        }

        this.remotePeerConnection.onTrack((e) => {
            if (this.media.nativeElement.srcObject !== e.streams[0]) {
                console.log(`${this.memberIdentifier} added remote peer tracks to the media HTML element`);
                this.media.nativeElement.srcObject = e.streams[0];
            }
        });

        this.remotePeerConnection.onIceCandidate((e) => {
            if (e.candidate) {
                console.log('Added ice candidate');
                this.remotePeerConnection.addIceCandidate(e.candidate);
            }
        });

        this.remotePeerConnection.rtcPeerConnection.onicecandidateerror = (e) => {
            console.log('An error occurred when adding ice candidate ' + e);
        };

        this.input.onDataExchange((data: IResponseData) => {
            const body = data.body;

            console.log(`${this.memberIdentifier} data_exchange event has been received with type ${body.type}`);

            if (body.type === 'offer') {
                this.remotePeerConnection.setRemoteDescription(body.data);

                console.log(`${this.memberIdentifier} received an offer`);
                this.remotePeerConnection.createAnswer().then((answer: RTCSessionDescription) => {
                    this.remotePeerConnection.setLocalDescription(answer);

                    console.log(`${this.memberIdentifier} sends an answer`);

                    this.output.sendDataExchange({
                        type: 'answer',
                        data: answer,
                        roomIdentifier: this.roomIdentifier.roomIdentifier,
                        fromMember: this.memberIdentifier,
                        originalSender: body.fromMember,
                    });
                });
            } else if (body.type === 'answer') {
                console.log(`${this.memberIdentifier} receives an answer`);

                this.remotePeerConnection.setLocalDescription(this.savedOffer);
                this.remotePeerConnection.setRemoteDescription(body.data);
            }
        });
    }
}
