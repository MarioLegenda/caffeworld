import {ObservableInput, Subject} from "rxjs";
import {catchError} from "rxjs/operators";
import {of} from "rxjs/internal/observable/of";

export default class GetUserMedia {
    private subject: Subject<any>;
    private stream;

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

        this.subject.pipe(catchError(this.onError));

        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            this.stream = stream;
            this.subject.next(stream);
        });
    }

    destroy() {
        this.subject.unsubscribe();
        this.subject = null;
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;
    }

    subscribe(subscriber: (value: any) => void, context: object | null = null) {
        return this.subject.subscribe((stream) => {
            subscriber.call((context) ? context: this, ...[stream]);
        });
    }

    private onError(err: any, observable: ObservableInput<any>): ObservableInput<any> {
        console.error(`An error occurred in GetUserMedia with message: ${err.message}`);

        return of(err);
    }

    static create(constraints: object) {
        return new GetUserMedia(constraints);
    }
}
