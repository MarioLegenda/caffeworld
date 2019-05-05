export default class GetUserMediaProxy {
    private stream;
    private constraints;

    /**
     * 'ideaLow' is simply an easier way to make the video the lowest quality possible to
     * save on CPU usage. Can only be used trough the static create() method
     * @param constraints
     */
    private constructor(constraints?) {
        if (constraints) {
            if (constraints.hasOwnProperty('idealLow') && constraints.idealLow === true) {
                constraints = {
                    audio: {echoCancellation: true},
                    video: {
                        width: 240,
                        height: 240,
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
            if (elem) elem.srcObject = stream;

            this.stream = stream;
        }).catch(this.onError);
    }

    destroy() {
        this.stream.getTracks().forEach(track => track.stop());
        this.constraints = null;
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
