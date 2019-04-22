import {IRTCConfiguration} from "./contract/IRTCConfiguration";

export default class PeerConnection {
    private configuration: IRTCConfiguration | null;

    private rtcPeerConnection: RTCPeerConnection;

    setConfiguration(configuration?: IRTCConfiguration | null): PeerConnection {
        this.configuration = configuration;

        return this;
    }

    onIceCandidate(subscriber: (event: RTCPeerConnectionIceEvent) => any) {
        this.rtcPeerConnection.onicecandidate = subscriber;
    }

    onNegotiationNeeded(subscriber: (event: RTCPeerConnectionIceEvent) => any) {
        this.rtcPeerConnection.onnegotiationneeded = subscriber;
    }

    onTrack(subscriber: (event: RTCTrackEvent) => any) {
        this.rtcPeerConnection.ontrack = subscriber;
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
