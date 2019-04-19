import AppSocket from "./AppSocket";
import {Injectable} from "@angular/core";

@Injectable()
export class TableSocketService {
    constructor(private socket: AppSocket) {}

    emitCreateTable(data: object) {
        this.socket.emit("app.create-table", data);
    }

    onCreateTable() {
    }
}
