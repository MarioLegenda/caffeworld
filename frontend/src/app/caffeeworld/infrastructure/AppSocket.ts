import io from 'socket.io-client';
import {from, Observable, Subject} from "rxjs";
import * as SocketIO from "socket.io";
import {Injectable} from "@angular/core";

@Injectable()
export default class AppSocket {
    private static socket: SocketIO.Server;
    private static singleton: AppSocket;

    private observables = {};

    static create(url: string, config: object): AppSocket {
        if (AppSocket.singleton) {
            return AppSocket.singleton;
        }

        AppSocket.socket = io(url, config);
        AppSocket.singleton = new AppSocket();

        return AppSocket.singleton;
    }

    emit(event: string, data: any): void {
        AppSocket.socket.emit(event, data);
    }

    observe(event: string): Observable<any> {
        this.createObservable(event);

        AppSocket.socket.on(event, () => {
            console.log('Event ' + event + ' has been received');
            AppSocket.socket.emit('app.example');
        });

        return this.getObservable(event);
    }

    private createObservable(event: string): void {
        if (!this.observables.hasOwnProperty(event)) {
            this.observables[event] = new Subject();
        }
    }

    private getObservable(event: string): Subject<any> {
        if (!this.observables.hasOwnProperty(event)) {
            throw new Error(`Cannot get observable. Observable under name '${event}' does not exist`)
        }

        return this.observables[event];
    }
}
