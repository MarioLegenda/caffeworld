import {Injectable} from "@angular/core";
import {ReplaySubject} from "rxjs";
import IObservableFactory from "./IObservableFactory";

@Injectable()
export default class SingleEventObservableFactory implements IObservableFactory{
    private observable: ReplaySubject<any>;
    private name: string;

    createObservable(name: string): void {
        this.name = name;
        this.observable = new ReplaySubject();
    }

    hasObservable(name: string): boolean {
        return name === this.name;
    }

    getObservable(name: string): ReplaySubject<any> {
        if (name !== this.name) throw new Error(`SingleEventObservableFactory error. Current observable is ${this.name} but you wanted ${name}. Create a new observable with the name '${name}' and call ObservableFactory::getObservable() with that name`);

        return this.observable;
    }

    unsubscribe(): void {
        this.observable.unsubscribe();
        this.observable = null;
        this.name = null;
    }

    get subscriberCount() {
        return this.observable.observers.length;
    }
}
