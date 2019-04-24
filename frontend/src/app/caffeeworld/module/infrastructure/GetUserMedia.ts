import {ObservableInput, Subject} from "rxjs";
import {catchError} from "rxjs/operators";
import {of} from "rxjs/internal/observable/of";
import {Injectable} from "@angular/core";

@Injectable()
export default class GetUserMedia {
    private subject: Subject<any>;
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

        this.subject = new Subject();

        this.subject.pipe(catchError(this.onError));
    }

    destroy() {
        if (!this.subject.closed) {
            this.subject.unsubscribe();
        }

        this.subject = null;
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;
        this.constraints = null;
    }

    subscribe(subscriber: (value: any) => void, context: object | null = null) {
        navigator.mediaDevices.getUserMedia(this.constraints).then((stream) => {
            this.stream = stream;

            this.subject.subscribe((stream) => {
                subscriber.call((context) ? context: this, ...[stream]);
            });
        });

        return this.subject;
    }

    private onError(err: any, observable: ObservableInput<any>): ObservableInput<any> {
        console.error(`An error occurred in GetUserMedia with message: ${err.message}`);

        return of(err);
    }

    static create(constraints: object) {
        return new GetUserMedia(constraints);
    }
}
