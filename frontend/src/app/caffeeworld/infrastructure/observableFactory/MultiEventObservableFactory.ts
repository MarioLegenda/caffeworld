import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import IObservableFactory from "./IObservableFactory";
import SingleEventObservableFactory from "./SingleEventObservableFactory";

@Injectable()
export default class MultiEventObservableFactory implements IObservableFactory {
    private observables = new Map<string, Subject<any>>();
    private singleEventObsFactory: SingleEventObservableFactory;

    constructor(singleEventObservableFactory: SingleEventObservableFactory) {
        this.singleEventObsFactory = singleEventObservableFactory;
    }

    createObservable(name: string): void {
        if (this.hasObservable(name)) {
            throw new Error(`CacheableObservableFactory error. Observable '${name}' already exists`);
        }

        this.singleEventObsFactory.createObservable(name);

        this.observables.set(name, this.singleEventObsFactory.getObservable(name));
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
