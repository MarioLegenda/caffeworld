import Socket from "../web/Socket";
import {injectable} from "inversify";

@injectable()
export default class Output {
    private readonly createTableEvent: string = 'app.server.table.create';
    private readonly iceOfferCreatedEvent = 'app.server.ice.offer_created';
    private readonly iceCandidateServerEvent = 'app.server.ice.candidate';
    private readonly roomEnteredEvent = 'app.server.room.entered';

    onTableCreate(middlewareImpl?: Function | null, context?: object): void {
        Socket.socket.on(this.createTableEvent, (data) => middlewareImpl(data, (context) ? context : this));
    }

    onOfferCreated(middlewareImpl?: Function | null, context?: object): void {
        Socket.socket.on(this.iceOfferCreatedEvent, (data) => middlewareImpl(data, (context) ? context : this));
    }

    onRoomEntered(middlewareImpl?: Function | null, context?: object): void {
        Socket.socket.on(this.roomEnteredEvent, (data) => middlewareImpl(data, (context) ? context : this));
    }

    onIceCandidate(middlewareImpl?: Function | null, context?: object): void {
        Socket.socket.on(this.iceCandidateServerEvent, (data) => middlewareImpl(data, (context) ? context : this));
    }
}
