import io from 'socket.io-client';
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export default class SingletonSocketInstance {
    private readonly socketIo: any;

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
