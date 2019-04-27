import SingletonSocketInstance from "../socket/SingletonSocketInstance";
import {Injectable} from "@angular/core";

@Injectable()
export default class Input {
    private socket;

    private readonly tableCreatedEvent = 'app.client.table.created';

    constructor(socket: SingletonSocketInstance) {
        this.socket = socket.socket;
    }

    onTableCreated(subscriber, context?: object): void {
        this.socket.on(this.tableCreatedEvent, (context) ? subscriber.bind(this) : subscriber);
    }
}
