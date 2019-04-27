import {Injectable} from "@angular/core";
import SingletonSocketInstance from "../socket/SingletonSocketInstance";

@Injectable()
export default class Input {
    private socket;

    private readonly createTableEvent = 'app.server.table.create';

    constructor(socket: SingletonSocketInstance) {
        this.socket = socket.socket;
    }

    sendCreateTable(data: object): void {
        this.socket.emit(this.createTableEvent, data);
    }
}
