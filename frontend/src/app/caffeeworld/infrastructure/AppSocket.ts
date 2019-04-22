import io from 'socket.io-client';
import {Observable} from "rxjs";
import * as SocketIO from "socket.io";
import {Injectable} from "@angular/core";
import ObservableFactory from "./ObservableFactory";

@Injectable({
    providedIn: 'root'
})
export default class AppSocket {
    private socket: SocketIO.Server;
    private observableFactory: ObservableFactory;

    constructor(
        url: string,
        config: object,
        observableFactory: ObservableFactory
    ) {
        this.socket = io(url, config);
        this.observableFactory = observableFactory;
    }

    emit(event: string, data: any): void {
        this.socket.emit(event, data);
    }

    observe(event: string): Observable<any> {
        const subject = this.observableFactory.createAndGetObservable(event);

        this.socket.on(event, (data) => {
            subject.next(data);
        });

        return this.observableFactory.getObservable(event);
    }
}
