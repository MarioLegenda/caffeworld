import {injectable} from "inversify";
import Socket from "../web/Socket";
import IResponseData from "../web/IResponseData";
import {TransportTypeEnum} from "../web/TrasportTypeEnum";

@injectable()
export default class Output {
    private readonly tableCreatedEvent: string = 'app.client.table.created';

    createTable(data): void {
        Socket.socket.emit(this.tableCreatedEvent, this.createResponseData(data, TransportTypeEnum.Socket));
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
