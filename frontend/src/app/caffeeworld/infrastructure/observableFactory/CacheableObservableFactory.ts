import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import IObservableFactory from "./IObservableFactory";

@Injectable()
export default class CacheableObservableFactory implements IObservableFactory {
    private observables = new Map<string, Subject<any>>();

    createObservable(name: string): void {
        this.observables.set(name, new Subject());
    }

    hasObservable(name: string): boolean {
        return this.observables.has(name);
    }

    getObservable(name: string): Subject<any> {
        return this.observables.get(name);
    }

    unsubscribe(): void {
        Object.values(this.observables).forEach((value: Subject<any>, key) => {
            value.unsubscribe();
        });

        this.observables = new Map<string, Subject<any>>();
    }

    subscriberCount(name: string) {
        if (this.hasObservable(name)) throw new Error(`CacheableObservableFactory error. Observable '${name}' not found`);

        return this.getObservable(name).observers.length;
    }
}
