import * as SocketIO from "socket.io";
import io from 'socket.io-client';
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export default class SingletonSocketInstance {
    private readonly socketIo: SocketIO.Server;

    constructor(
        url: string,
        config: object,
    ) {
        this.socketIo = io(url, config);
    }

    get socket() {
        return this.socketIo;
    }
}
