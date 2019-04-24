import AppSocket from "./AppSocket";
import {Injectable} from "@angular/core";

@Injectable()
export class TableSocketService {
    constructor(private socket: AppSocket) {}

    emitCreateTable(data: object) {
        this.socket.emit('app.event.table.create', data);
    }

    onTableCreated(subscriber) {
        this.socket.observe('app.event.table.created').subscribe(subscriber);
    }

    unsubscribe() {
        this.socket.unsubscribe();
    }
}
