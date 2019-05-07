import {Injectable} from "@angular/core";
import Socket from "../socket/Socket";
import IInput from "./IInput";

@Injectable()
export class Input implements IInput {
    private readonly tableCreatedEvent = 'app.client.table.created';
    private readonly roomUpdatedEvent = 'app.client.room.room_updated';
    private readonly roomLeaveEvent = 'app.client.room.room_leave';
    private readonly dataExchangeEvent = 'app.client.room.data_exchange';
    private readonly iceExchangeEvent = 'app.client.room.ice_candidate_exchange';
    private readonly chatMessageEvent = 'app.client.room.chat_message';
    private readonly maxSessionsEvent =  'app.client.max_sessions';

    onTableCreated(subscriber, context?: object): void {
        Socket.table.on(this.tableCreatedEvent, (context) ? subscriber.bind(this) : subscriber);
    }

    onRoomUpdated(subscriber, context?: object): void {
        Socket.room.on(this.roomUpdatedEvent, (context) ? subscriber.bind(this) : subscriber);
    }

    onRoomLeave(subscriber, context?: object): void {
        Socket.room.on(this.roomLeaveEvent, (context) ? subscriber.bind(this) : subscriber);
    }

    onDataExchange(subscriber, context?: object): void {
        Socket.room.on(this.dataExchangeEvent, (context) ? subscriber.bind(this) : subscriber);
    }

    onIceCandidateExchange(subscriber, context?: object): void {
        Socket.room.on(this.iceExchangeEvent, (context) ? subscriber.bind(this) : subscriber);
    }

    onChatMessage(subscriber, context?: object): void {
        Socket.room.on(this.chatMessageEvent, (context) ? subscriber.bind(this) : subscriber);
    }

    onMaxSessions(subscriber, context?: object): void {
        Socket.room.on(this.maxSessionsEvent, (context) ? subscriber.bind(this) : subscriber);
    }
}
