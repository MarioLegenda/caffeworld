import {Injectable} from "@angular/core";
import SingletonSocketInstance from "./../socket/SingletonSocketInstance";

@Injectable()
export default class SessionUpdatedEvent {
    private socket;

    private readonly iceAnswerEvent = 'app.client.ice.answer';

    constructor(
        socket: SingletonSocketInstance,
    ) {
        this.socket = socket.socket;
    }

    onIceAnswer(subscriber, context?: object) {
        this.socket.on(this.iceAnswerEvent, (context) ? subscriber.bind(this) : subscriber);
    }
}
