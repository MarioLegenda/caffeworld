import {Injectable} from "@angular/core";
import SingletonSocketInstance from "./../socket/SingletonSocketInstance";

@Injectable()
export default class RoomEnteredEvent {
    private socket;

    constructor(socket: SingletonSocketInstance) {
        this.socket = socket.socket;
    }

    private readonly roomEnteredEvent = 'app.server.room.entered';

    emitRoomEntered(data) {
        this.socket.emit(this.roomEnteredEvent, data);
    }
}
