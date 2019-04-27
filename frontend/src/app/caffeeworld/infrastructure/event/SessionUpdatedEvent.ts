import {Injectable} from "@angular/core";
import SingletonSocketInstance from "./../socket/SingletonSocketInstance";
import RoomIdentifier from "../../module/infrastructure/RoomIdentifier";

@Injectable()
export default class SessionUpdatedEvent {
    private socket;

    private readonly sessionUpdatedEvent = 'app.client.room.session_updated';
    private readonly sessionDisconnectedEvent = 'app.client.room.session_disconnect';
    private readonly roomIdentifier: string;

    constructor(
        socket: SingletonSocketInstance,
        roomIdentifier: RoomIdentifier
    ) {
        this.socket = socket.socket;
        this.roomIdentifier = roomIdentifier.roomIdentifier;
    }

    onSessionUpdated(subscriber, context?: object) {
        this.socket.on(this.sessionUpdatedEvent, (context) ? subscriber.bind(this) : subscriber);
    }

    onSessionDisconnect(subscriber, context?: object) {
        this.socket.on(this.sessionDisconnectedEvent, (context) ? subscriber.bind(this) : subscriber);
    }
}
