import * as SocketIO from "socket.io";
import {Injectable} from "@angular/core";
import SingletonSocketInstance from "./socket/SingletonSocketInstance";
import IObservableFactory from "./observableFactory/IObservableFactory";
import {Subject} from "rxjs";

@Injectable()
export default class AppSocket {
    private socket: SocketIO.Server;
    private observableFactory: IObservableFactory;

    constructor(
        socketInstance: SingletonSocketInstance,
        observableFactory: IObservableFactory
    ) {
        this.socket = socketInstance.socket;
        this.observableFactory = observableFactory;
    }

    emit(event: string, data: any): void {
        this.socket.emit(event, data);
    }

    observe(event: string): Subject<any> {
        if (!this.observableFactory.hasObservable(event)) {
            this.observableFactory.createObservable(event);
        }

        this.socket.on(event, (data) => {
            this.observableFactory.getObservable(event).next(data);
        });

        return this.observableFactory.getObservable(event);
    }

    unsubscribe() {
        this.observableFactory.unsubscribe();
    }
}
