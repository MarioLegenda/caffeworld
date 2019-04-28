import PeerConnectionProxy from "./PeerConnectionProxy";

export default class GetUserMediaProxy {
    private stream;
    private constraints;

    constructor(constraints?) {
        if (constraints) {
            if (constraints.hasOwnProperty('idealLow') && constraints.idealLow === true) {
                constraints = {
                    audio: true,
                    video: {
                        width: 160,
                        height: 160,
                        frameRate: 8
                    }
                }
            }
        }

        this.constraints = constraints;
    }

    connect(
        peerConnection: PeerConnectionProxy,
        nativeElement,
        subscriber?,
        context?: object | null) {

        subscriber = (subscriber) ? subscriber : (stream) => {
            nativeElement.volume = 0;
            nativeElement.muted = 0;

            nativeElement.srcObject = stream;

            peerConnection.addTracks(stream);
        };

        return navigator.mediaDevices.getUserMedia(this.constraints).then((stream) => {
            this.stream = stream;

            subscriber.call((context) ? context : null, ...[stream]);
        }).catch(this.onError);
    }

    private onError(err: any) {
        console.error(`An error occurred in GetUserMedia with message: ${err.message}`);
    }

    destroy() {
        this.stream.getTracks().forEach(track => track.stop());
        
        this.stream = null;
    }

    static create(constraints?: object) {
        constraints = (constraints) ? constraints : {idealLow: true};

        return new GetUserMediaProxy(constraints);
    }
}
