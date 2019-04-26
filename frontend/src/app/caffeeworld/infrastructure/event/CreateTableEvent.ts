import {Injectable} from "@angular/core";
import SingletonSocketInstance from "./../socket/SingletonSocketInstance";

@Injectable()
export class CreateTableEvent {
    private socket;

    constructor(socket: SingletonSocketInstance) {
        this.socket = socket.socket;
    }

    private readonly createTableEvent = 'app.server.table.create';
    private readonly tableCreatedEvent = 'app.client.table.created';

    emitCreateTable(data: object) {
        this.socket.emit(this.createTableEvent, data);
    }

    onTableCreated(subscriber, context?: object) {
        this.socket.on(this.tableCreatedEvent, (context) ? subscriber.bind(this) : subscriber);
    }
}
