import Socket from "../web/Socket";
import {injectable} from "inversify";

@injectable()
export default class Output {
    private readonly createTableEvent: string = 'app.server.table.create';
    private readonly iceOfferCreatedEvent = 'app.server.ice.offer_created';

    onTableCreate(middlewareImpl?: Function | null, context?: object): void {
        Socket.socket.on(this.createTableEvent, (data) => middlewareImpl(data, (context) ? context : this));
    }

    onOfferCreated(middlewareImpl?: Function | null, context?: object) {
        Socket.socket.on(this.iceOfferCreatedEvent, (data) => middlewareImpl(data, (context) ? context : this));
    }
}
