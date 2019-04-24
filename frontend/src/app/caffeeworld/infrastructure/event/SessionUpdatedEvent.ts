import {Injectable} from "@angular/core";
import SingletonSocketInstance from "./../socket/SingletonSocketInstance";

@Injectable()
export default class SessionUpdatedEvent {
    private socket;

    private readonly sessionUpdatedEvent = 'app.events.room.session_updated';

    constructor(socket: SingletonSocketInstance) {
        this.socket = socket.socket;
    }

    onSessionUpdated(subscriber, context?: object) {
        this.socket.on(this.sessionUpdatedEvent, (context) ? subscriber.bind(this) : subscriber);
    }
}
