import {Injectable} from "@angular/core";
import Socket from "../socket/Socket";
import IOutput from "./IOutput";

@Injectable()
export default class Input implements IOutput {
    private readonly createTableEvent = 'app.server.table.create';
    private readonly roomEnteredEvent = 'app.server.room.entered';

    sendCreateTable(data: any): void {
        Socket.table.emit(this.createTableEvent, data);
    }

    sendRoomEntered(data: any): void {
        Socket.room.emit(this.roomEnteredEvent, data);
    }
}
