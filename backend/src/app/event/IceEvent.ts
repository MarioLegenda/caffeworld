import {inject, injectable} from "inversify";
import {Symbols} from "../../container/Symbols";
import SingletonSocketInstance from "../web/SingletonSocketInstance";

@injectable()
export default class IceEvent {
    private socket;

    private readonly iceOfferCreatedEvent = 'app.server.ice.offer_created';

    constructor(
        @inject(Symbols.SingletonSocketInstance) socket: SingletonSocketInstance
    ) {
        this.socket = socket.socket;
    }

    onOfferCreated(middlewareImpl?: Function | null, context?: object) {
        this.socket.on(this.iceOfferCreatedEvent, (data) => middlewareImpl(data, (context) ? context : this));
    }
}
