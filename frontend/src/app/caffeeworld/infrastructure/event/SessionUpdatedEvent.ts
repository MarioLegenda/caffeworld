import {Injectable} from "@angular/core";
import RoomIdentifier from "../../module/infrastructure/RoomIdentifier";
import Socket from "../socket/Socket";

@Injectable()
export default class SessionUpdatedEvent {
    private readonly sessionDisconnectedEvent = 'app.client.room.session_disconnect';
    private readonly roomIdentifier: string;

    constructor(
        roomIdentifier: RoomIdentifier
    ) {
        this.roomIdentifier = roomIdentifier.roomIdentifier;
    }

    onSessionDisconnect(subscriber, context?: object) {
        Socket.room.on(this.sessionDisconnectedEvent, (context) ? subscriber.bind(this) : subscriber);
    }
}
