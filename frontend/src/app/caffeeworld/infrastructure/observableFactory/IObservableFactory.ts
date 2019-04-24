import {Subject} from "rxjs";

export default interface IObservableFactory {
    createObservable(name: string): void;
    getObservable(name: string): Subject<any>;
    hasObservable(name: string): boolean;
    unsubscribe(): void;
}
