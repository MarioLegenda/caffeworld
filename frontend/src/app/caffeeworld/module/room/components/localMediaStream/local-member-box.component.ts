import {Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import PeerConnectionProxy from "../../../infrastructure/WebRTC/PeerConnectionProxy";
import GetUserMediaProxy from "../../../infrastructure/WebRTC/GetUserMediaProxy";
import Output from "../../../../infrastructure/event/Output";
import {Input as DataInput} from "../../../../infrastructure/event/Input";
import IInput from "../../../../infrastructure/event/IInput";
import IOutput from "../../../../infrastructure/event/IOutput";
import RoomIdentifier from "../../../infrastructure/RoomIdentifier";

@Component({
    selector: 'app-local-member-box',
    templateUrl: './member-box.component.html',
    styleUrls: ['./member-box.component.scss'],
})
export class LocalMemberBoxComponent implements OnDestroy {
    @ViewChild('media') media: ElementRef;

    @Input('newMember') newMember: string;
    @Input('memberIdentifier') memberIdentifier: string;

    private readonly getUserMedia: GetUserMediaProxy;
    private readonly localPeerConnection: PeerConnectionProxy;

    private localUserMedia;

    private readonly input: IInput;
    private readonly output: IOutput;
    private readonly roomIdentifier: RoomIdentifier;

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

        this.localPeerConnection = PeerConnectionProxy.create(configuration);
        this.localUserMedia = GetUserMediaProxy.create();
    }

    async ngOnInit() {
        await this.handleUserMedia();
    }

    ngOnDestroy(): void {
        this.getUserMedia.destroy();
    }

    async handleUserMedia() {
        await this.localUserMedia.connect();

        this.media.nativeElement.muted = true;

        this.localPeerConnection.addTracks(this.localUserMedia.mediaStream);

        this.handlePeerConnectionEvents();

        await this.localUserMedia.connect();
    }

    private handlePeerConnectionEvents() {
        this.localPeerConnection.onIceCandidate((e) => {
            if (e.candidate) {
                console.log('Locald peer onicecandidate: Added ice candidate');
                this.localPeerConnection.addIceCandidate(e.candidate);
            }
        });
    }
}
