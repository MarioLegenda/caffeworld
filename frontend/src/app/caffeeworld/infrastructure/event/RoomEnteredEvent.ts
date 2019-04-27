import {Injectable} from "@angular/core";
import SingletonSocketInstance from "./../socket/SingletonSocketInstance";

@Injectable()
export default class RoomEnteredEvent {
    private socket;
    private readonly roomEnteredEvent = 'app.server.room.entered';

    constructor(socket: SingletonSocketInstance) {
        this.socket = socket.socket;
    }

    emitRoomEntered(data) {
        this.socket.emit(this.roomEnteredEvent, data);
    }
}
