import {Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import PeerConnectionProxy from "../../../infrastructure/WebRTC/PeerConnectionProxy";
import GetUserMediaProxy from "../../../infrastructure/WebRTC/GetUserMediaProxy";
import Output from "../../../../infrastructure/event/Output";
import {Input as DataInput} from "../../../../infrastructure/event/Input";
import IInput from "../../../../infrastructure/event/IInput";
import IOutput from "../../../../infrastructure/event/IOutput";
import IResponseData from "../../../../infrastructure/web/IResponseData";
import RoomIdentifier from "../../../infrastructure/RoomIdentifier";

@Component({
    selector: 'app-media-box',
    templateUrl: './media-box.component.html',
    styleUrls: ['./media-box.component.scss'],
})
export class MediaBoxComponent implements OnDestroy {
    @ViewChild('remote') remote: ElementRef;
    @ViewChild('local') local: ElementRef;

    @Input('memberIdentifier') memberIdentifier: string;
    @Input('newMember') newMember: string;
    @Input('isLocal') isLocal: boolean;

    private readonly getUserMedia: GetUserMediaProxy;
    private readonly remotePeerConnection: PeerConnectionProxy;
    private readonly localUserMedia: GetUserMediaProxy;

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
        this.localUserMedia = GetUserMediaProxy.create();
    }

    async ngOnInit() {
        await this.handleUserMedia();

        this.handlePeerConnectionEvents();

    }

    ngOnDestroy(): void {
        this.getUserMedia.destroy();
    }

    async handleUserMedia() {
        console.log(`Created local getUserMedia objects and added tracks for it`);

        await this.localUserMedia.connect(this.local.nativeElement);
        await this.remoteUserMedia.connect();
        this.remotePeerConnection.addTracks(this.remoteUserMedia.mediaStream);

        this.local.nativeElement.muted = 0;
        this.local.nativeElement.volume = 0;
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
            if (this.remote.nativeElement.srcObject !== e.streams[0]) {
                console.log(`${this.memberIdentifier} added remote peer tracks to the media HTML element`);
                this.remote.nativeElement.srcObject = e.streams[0];
            }
        });

        this.remotePeerConnection.onIceCandidate((e) => {
            if (e.candidate) {
                console.log(`${this.memberIdentifier} is sending and ice candidate`);
                this.output.sendIceExchangeEvent({
                    roomIdentifier: this.roomIdentifier.roomIdentifier,
                    candidate: e.candidate
                });
            }
        });

        this.remotePeerConnection.onAddStream((e) => {
            console.log(`onaddstream event called`, e);
        });

        this.remotePeerConnection.onIceCandidateStateChange((e) => {
            console.log(`onicecandidatestatechange event called`, e);
        });

        this.remotePeerConnection.onIceGatheringStateChange((e) => {
            console.log(`onicegatheringstatechange event called`, e);
        });

        this.remotePeerConnection.onRemoveStream((e) => {
            console.log(`onremovestream event called`, e);
        });

        this.remotePeerConnection.rtcPeerConnection.onicecandidateerror = (e) => {
            console.log('An error occurred when adding ice candidate ' + e);
        };

        this.input.onIceCandidateExchange((data: IResponseData) => {
            console.log(`Ice candidate received and added`);
            this.remotePeerConnection.addIceCandidate(data.body.candidate);
        });

        this.input.onDataExchange(async (data: IResponseData) => {
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
