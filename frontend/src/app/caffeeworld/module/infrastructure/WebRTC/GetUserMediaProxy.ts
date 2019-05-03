export default class GetUserMediaProxy {
    private stream;
    private constraints;

    constructor(constraints?) {
        if (constraints) {
            if (constraints.hasOwnProperty('idealLow') && constraints.idealLow === true) {
                constraints = {
                    audio: {echoCancellation: true},
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

    get mediaStream() {
        return this.stream;
    }

    connect(elem?) {
        return navigator.mediaDevices.getUserMedia(this.constraints).then((stream) => {
            console.log(elem);
            if (elem) elem.srcObject = stream;

            this.stream = stream;
        }).catch(this.onError);
    }

    destroy() {
        this.stream.getTracks().forEach(track => track.stop());

        this.stream = null;
    }

    private onError(err: any) {
        console.error(`An error occurred in GetUserMedia with message: ${err.message}`);
    }

    static create(constraints?: object) {
        constraints = (constraints) ? constraints : {idealLow: true};

        return new GetUserMediaProxy(constraints);
    }
}
