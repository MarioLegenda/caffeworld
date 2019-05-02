import {TransportTypeEnum} from "./TrasportTypeEnum";

export default interface IResponseData {
    transportType: TransportTypeEnum,
    http: object | null,
    socket: object | null,
    body: any | null;
}
