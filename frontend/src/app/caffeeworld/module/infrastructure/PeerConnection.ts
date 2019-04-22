import {IRTCConfiguration} from "./contract/IRTCConfiguration";
import {Subject} from "rxjs";

export default class PeerConnection {
    private configuration: IRTCConfiguration | null;

    private rtcPeerConnection: RTCPeerConnection;

    setConfiguration(configuration?: IRTCConfiguration | null): PeerConnection {
        this.configuration = configuration;

        return this;
    }

    onIceCandidate(subscriber: Function) {
    }

    onNegotiationNeeded(subscriber: Function) {
    }

    onTrack(subscriber: Function) {

    }

    create(): RTCPeerConnection {
        this.rtcPeerConnection = new RTCPeerConnection(this.configuration);

        return this.rtcPeerConnection;
    }

    getProp(name: string): any {
        if (!this.rtcPeerConnection) {
            throw new Error(`PeerConnection error. RTCPeerConnection object was not created. PeerConnection is a chainable builder. You have to call the PeerConnection::create() method first`);
        }

        if (!this.rtcPeerConnection.hasOwnProperty(name)) {
            throw new Error(`PeerConnection error. ${name} is not a property of object RTCPeerConnection`);
        }

        return this.rtcPeerConnection[name];
    }
}
