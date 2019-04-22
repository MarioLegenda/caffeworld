import {Subject} from "rxjs";

export default class GetUserMedia {
    private subject: Subject<any>;

    constructor(constraints) {
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

        this.subject = new Subject();

        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            this.subject.next(stream);
        });
    }

    flush() {
        this.subject.unsubscribe();
        this.subject = null;
    }

    subscribe(subscriber: (value: any) => void) {
        return this.subject.subscribe(subscriber);
    }

    static create(constraints: object) {
        return new GetUserMedia(constraints);
    }
}
