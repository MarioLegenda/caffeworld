import {Injectable} from "@angular/core";
import Socket from "../socket/Socket";
import IInput from "./IInput";

@Injectable()
export default class Input implements IInput {
    private readonly tableCreatedEvent = 'app.client.table.created';
    private readonly roomUpdatedEvent = 'app.client.room.room_updated';
    private readonly roomLeaveEvent = 'app.client.room.room_leave';
    private readonly iceAnswerEvent = 'app.client.ice.answer';
    private readonly iceCandidateEvent = 'app.client.ice.candidate';

    onTableCreated(subscriber, context?: object): void {
        Socket.table.on(this.tableCreatedEvent, (context) ? subscriber.bind(this) : subscriber);
    }

    onRoomUpdated(subscriber, context?: object): void {
        Socket.room.on(this.roomUpdatedEvent, (context) ? subscriber.bind(this) : subscriber);
    }

    onRoomLeave(subscriber, context?: object): void {
        Socket.room.on(this.roomLeaveEvent, (context) ? subscriber.bind(this) : subscriber);
    }

    onIceAnswer(subscriber, context?: object): void {
        Socket.room.on(this.iceAnswerEvent, (context) ? subscriber.bind(this) : subscriber);
    }

    onAddIceCandidate(subscriber, context?: object): void {
        Socket.room.on(this.iceCandidateEvent, (context) ? subscriber.bind(this): subscriber);
    }
}
