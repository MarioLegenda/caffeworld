import {Injectable} from "@angular/core";
import Socket from "../socket/Socket";

@Injectable()
export default class SessionUpdatedEvent {
    private readonly iceAnswerEvent = 'app.client.ice.answer';

    onIceAnswer(subscriber, context?: object) {
        Socket.room.on(this.iceAnswerEvent, (context) ? subscriber.bind(this) : subscriber);
    }
}
