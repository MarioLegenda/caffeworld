import {Injectable} from "@angular/core";
import Socket from "../socket/Socket";

@Injectable()
export default class Input {
    private readonly tableCreatedEvent = 'app.client.table.created';
    private readonly roomUpdatedEvent = 'app.client.room.room_updated';

    onTableCreated(subscriber, context?: object): void {
        Socket.table.on(this.tableCreatedEvent, (context) ? subscriber.bind(this) : subscriber);
    }

    onRoomUpdated(subscriber, context?: object): void {
        Socket.room.on(this.roomUpdatedEvent, (context) ? subscriber.bind(this) : subscriber);
    }
}
