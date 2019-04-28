import {Injectable} from "@angular/core";
import Socket from "../socket/Socket";

@Injectable()
export default class Input {
    private readonly tableCreatedEvent = 'app.client.table.created';

    onTableCreated(subscriber, context?: object): void {
        Socket.table.on(this.tableCreatedEvent, (context) ? subscriber.bind(this) : subscriber);
    }
}
