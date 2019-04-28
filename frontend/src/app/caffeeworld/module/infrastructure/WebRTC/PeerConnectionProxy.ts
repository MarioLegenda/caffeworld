import {IRTCConfiguration} from "./dictionary/IRTCConfiguration";
import {Injectable} from "@angular/core";
import IRTCOfferOptions from "./dictionary/IRTCOfferOptions";

@Injectable()
export default class PeerConnectionProxy {
    private configuration: IRTCConfiguration | null;

    public rtcPeerConnection: RTCPeerConnection;

    constructor(rtcPeerConnection: RTCPeerConnection) {
        this.rtcPeerConnection = new RTCPeerConnection();
    }

    setConfiguration(configuration?: IRTCConfiguration | null): PeerConnectionProxy {
        this.configuration = configuration;

        return this;
    }

    addTracks(stream): void {
        stream.getTracks().forEach(track => this.rtcPeerConnection.addTrack(track, stream));
    }

    createOffer(options?: IRTCOfferOptions) {
        options = (options) ? options : undefined;

        return this.rtcPeerConnection.createOffer(options);
    }

    onIceCandidate(subscriber: (event: RTCPeerConnectionIceEvent) => any) {
        this.rtcPeerConnection.onicecandidate = subscriber;
    }

    addIceCandidate(candidate) {
        this.rtcPeerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }

    onNegotiationNeeded(subscriber: (event: RTCPeerConnectionIceEvent) => any) {
        this.rtcPeerConnection.onnegotiationneeded = subscriber;
    }

    onTrack(subscriber: (event: RTCTrackEvent) => any) {
        this.rtcPeerConnection.ontrack = subscriber;
    }

    setLocalDescription(desc: RTCSessionDescription) {
        this.rtcPeerConnection.setLocalDescription(desc);
    }

    setRemoteDescription(desc: RTCSessionDescription) {
        this.rtcPeerConnection.setRemoteDescription(desc);
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

    destroy() {
        this.rtcPeerConnection.close();
    }

    static create(config?: IRTCConfiguration) {
        config = (config) ? config : {};

        return new PeerConnectionProxy(new RTCPeerConnection(config));
    }
}
