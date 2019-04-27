import {inject, injectable} from "inversify";
import {Symbols} from "../../container/Symbols";
import SingletonSocketInstance from "../web/SingletonSocketInstance";
import Socket from "../web/Socket";

@injectable()
export default class RoomEvent {
    private socket;

    private readonly roomEnteredEvent = 'app.server.room.entered';
    private readonly memberLeftEvent = 'app.server.room.member_left';

    constructor(
        @inject(Symbols.SingletonSocketInstance) socket: SingletonSocketInstance
    ) {
        this.socket = socket.socket;
    }

    onRoomEntered(middlewareImpl?: Function | null, context?: object) {
        Socket.socket.on(this.roomEnteredEvent, (data) => middlewareImpl(data, (context) ? context : this));
    }
}
