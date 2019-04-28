import {Injectable} from "@angular/core";
import Socket from "../socket/Socket";

@Injectable()
export default class RoomEnteredEvent {
    private readonly roomEnteredEvent = 'app.server.room.entered';

    emitRoomEntered(data) {
        Socket.room.emit(this.roomEnteredEvent, data);
    }
}
