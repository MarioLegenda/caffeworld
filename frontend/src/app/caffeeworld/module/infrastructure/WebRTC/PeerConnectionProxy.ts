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

    onIceCandidate(subscriber: (event: RTCPeerConnectionIceEvent) => any) {
        return this.rtcPeerConnection.onicecandidate = subscriber;
    }

    onNegotiationNeeded(subscriber: any) {
        this.rtcPeerConnection.onnegotiationneeded = subscriber;
    }

    onAddStream(subscriber: any) {
        // @ts-ignore
        this.rtcPeerConnection.onaddstream = subscriber;
    }

    onIceCandidateStateChange(subscriber: any) {
        this.rtcPeerConnection.oniceconnectionstatechange = subscriber;
    }

    onIceGatheringStateChange(subscriber: any) {
        this.rtcPeerConnection.onicegatheringstatechange = subscriber;
    }

    onRemoveStream(subscriber: any) {
        // @ts-ignore
        this.rtcPeerConnection.onremovestream = subscriber;
    }

    onSignalingStateChange(subscriber: any) {
        this.rtcPeerConnection.onsignalingstatechange = subscriber;
    }

    addIceCandidate(candidate) {
        if (this.rtcPeerConnection.signalingState !== 'closed') {
            return this.rtcPeerConnection.addIceCandidate(candidate).catch((err) => console.error('An error occurred on addind ice candidate with message: ' + err.message));
        }
    }

    onTrack(subscriber: (event: RTCTrackEvent) => any) {
        this.rtcPeerConnection.ontrack = subscriber;
    }

    createAnswer() {
        return this.rtcPeerConnection.createAnswer();
    }

    createOffer() {
        return this.rtcPeerConnection.createOffer();
    }

    setLocalDescription(desc: RTCSessionDescription) {
        return this.rtcPeerConnection.setLocalDescription(desc);
    }

    setRemoteDescription(desc: RTCSessionDescription) {
        if (this.rtcPeerConnection.signalingState !== 'closed') {
            return this.rtcPeerConnection.setRemoteDescription(desc).catch((err) => console.error(`setRemoteDescription error with message: ${err.message}`));
        }
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
        this.rtcPeerConnection.onconnectionstatechange = null;
        this.rtcPeerConnection.onicecandidate = null;
        this.rtcPeerConnection.onnegotiationneeded = null;
        // @ts-ignore
        this.rtcPeerConnection.onaddstream = null;
        this.rtcPeerConnection.oniceconnectionstatechange = null;
        this.rtcPeerConnection.onicegatheringstatechange = null;
        // @ts-ignore
        this.rtcPeerConnection.onremovestream = null;
        this.rtcPeerConnection.onsignalingstatechange = null;
        this.rtcPeerConnection.ontrack = null;

        this.rtcPeerConnection.close();
    }

    static create(config?: IRTCConfiguration) {
        config = (config) ? config : null;

        return new PeerConnectionProxy(new RTCPeerConnection(config));
    }
}
