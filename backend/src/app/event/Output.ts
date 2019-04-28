import {injectable} from "inversify";
import Socket from "../web/Socket";
import IResponseData from "../web/IResponseData";
import {TransportTypeEnum} from "../web/TrasportTypeEnum";

@injectable()
export default class Output {
    private readonly tableCreatedEvent: string = 'app.client.table.created';
    private readonly roomUpdatedEvent = 'app.client.room.room_updated';
    private readonly roomLeaveEvent = 'app.client.room.room_leave';

    createTable(data): void {
        Socket.socket.emit(this.tableCreatedEvent, this.createResponseData(data, TransportTypeEnum.Socket));
    }

    sendUpdateRoom(roomIdentifier: string, data): void {
        Socket.namespace.to(roomIdentifier).emit(this.roomUpdatedEvent, this.createResponseData(data, TransportTypeEnum.Socket));
    }

    sendRoomLeave(roomIdentifier: string, data): void {
        Socket.namespace.to(roomIdentifier).emit(this.roomLeaveEvent, this.createResponseData(data, TransportTypeEnum.Socket));
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
