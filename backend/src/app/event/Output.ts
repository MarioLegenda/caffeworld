import {injectable} from "inversify";
import Socket from "../web/Socket";
import IResponseData from "../web/IResponseData";
import {TransportTypeEnum} from "../web/TrasportTypeEnum";
import IOutput from "./IOutput";

@injectable()
export default class Output implements IOutput {
    private readonly tableCreatedEvent: string = 'app.client.table.created';
    private readonly roomUpdatedEvent = 'app.client.room.room_updated';
    private readonly roomLeaveEvent = 'app.client.room.room_leave';
    private readonly iceOfferEvent: string = 'app.client.ice.offer';
    private readonly iceCandidateClientEvent: string = 'app.client.ice.candidate';

    createTable(data: any): void {
        Socket.socket.emit(this.tableCreatedEvent, this.createResponseData(data, TransportTypeEnum.Socket));
    }

    sendUpdateRoom(roomIdentifier: string, data: any): void {
        Socket.namespace.to(roomIdentifier).emit(this.roomUpdatedEvent, this.createResponseData(data, TransportTypeEnum.Socket));
    }

    sendRoomLeave(roomIdentifier: string, data: any): void {
        Socket.namespace.to(roomIdentifier).emit(this.roomLeaveEvent, this.createResponseData(data, TransportTypeEnum.Socket));
    }

    sendOffer(roomIdentifier: string, data: any) {
        Socket.namespace.to(roomIdentifier).emit(this.iceOfferEvent, data);
    }

    sendIceCandidate(roomIdentifier: string, data: any) {
        Socket.namespace.to(roomIdentifier).emit(this.iceCandidateClientEvent, data);
    }

    private createResponseData(data: any, transportType: TransportTypeEnum): IResponseData {
        return {
            transportType: transportType,
            http: null,
            socket: null,
            body: data,
        };
    }
}
