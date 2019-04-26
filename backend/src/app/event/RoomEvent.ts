import {inject, injectable} from "inversify";
import {Symbols} from "../../container/Symbols";
import SingletonSocketInstance from "../web/SingletonSocketInstance";

@injectable()
export default class RoomEvent {
    private socket;

    private readonly roomEnteredEvent = 'app.server.room.entered';

    constructor(
        @inject(Symbols.SingletonSocketInstance) socket: SingletonSocketInstance
    ) {
        this.socket = socket.socket;
    }

    onRoomEntered(middlewareImpl?: Function | null, context?: object) {
        this.socket.on(this.roomEnteredEvent, (data) => middlewareImpl(data, (context) ? context : this));
    }
}
