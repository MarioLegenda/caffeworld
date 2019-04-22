import {Observable, Subject} from "rxjs";
import {injectable} from "inversify";

@injectable()
export default class ObservableFactory {
    private observables = new Map();

    createAndGetObservable(name: string) {
        if (!this.observables.has(name)) {
            this.observables.set(name, new Subject());
        }

        return this.observables.get(name);
    }

    getObservable(name: string): Observable<object> {
        return this.observables.get(name);
    }

    unsubscribe() {
        this.observables.forEach((value: Subject<any>, key) => {
            value.unsubscribe();
        });

        this.observables = null;
        this.observables = new Map();
    }
}
