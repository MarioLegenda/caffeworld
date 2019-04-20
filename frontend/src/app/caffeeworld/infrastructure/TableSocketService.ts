import AppSocket from "./AppSocket";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

@Injectable()
export class TableSocketService {
    constructor(private socket: AppSocket) {}

    emitCreateTable(data: object) {
        this.socket.emit('app.event.table.create', data);
    }

    onCreateTable(): Observable<any> {
        return this.socket.observe('app.event.table.create');
    }
}
