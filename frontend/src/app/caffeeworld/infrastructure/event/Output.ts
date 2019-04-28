import {Injectable} from "@angular/core";
import Socket from "../socket/Socket";

@Injectable()
export default class Input {
    private readonly createTableEvent = 'app.server.table.create';
    private readonly roomEnteredEvent = 'app.server.room.entered';

    sendCreateTable(data: object): void {
        Socket.table.emit(this.createTableEvent, data);
    }

    sendRoomEntered(data) {
        Socket.room.emit(this.roomEnteredEvent, data);
    }
}
