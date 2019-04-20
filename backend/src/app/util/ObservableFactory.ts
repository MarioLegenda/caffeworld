import {Observable, Subject} from "rxjs";
import {injectable} from "inversify";

@injectable()
export default class ObservableFactory {
    private observables = {};

    createAndGetObservable(name: string) {
        if (!this.observables.hasOwnProperty(name)) {
            this.observables[name] = new Subject();
        }

        return this.observables[name];
    }

    getObservable(name: string): Observable<object> {
        return this.observables[name];
    }
}
