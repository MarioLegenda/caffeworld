import {inject, injectable} from "inversify";
import {Symbols} from "../../container/Symbols";
import SingletonSocketInstance from "../web/SingletonSocketInstance";

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
        this.socket.on(this.roomEnteredEvent, (data) => middlewareImpl(data, (context) ? context : this));
    }

    onMemberLeft(middlewareImpl?: Function | null, context?: object) {
        this.socket.on(this.memberLeftEvent, (data) => middlewareImpl(data, (context) ? context : this));
    }
}
