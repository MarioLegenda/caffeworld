import {inject, injectable} from "inversify";
import Redis from "../../dataSource/redis";
import ISocketData from "../util/ISocketData";
import IResponseData from "../web/IResponseData";
import {TransportTypeEnum} from "../web/TrasportTypeEnum";
import {Symbols} from "../../container/Symbols";
import SingletonSocketInstance from "../web/SingletonSocketInstance";

const uuid = require('uuid/v4');

@injectable()
export default class TableService {

    private readonly socket;

    constructor(
        @inject(Symbols.SingletonSocketInstance) socket: SingletonSocketInstance
    ) {
        this.socket = socket.socket;
    }

    createTable(socketMiddlewareResult: ISocketData) {
        const {data} = socketMiddlewareResult;

        const roomIdentifier: string = uuid();

        const url = `${process.env.SITE_URL}/table/${roomIdentifier}`;

        const redisData = {
            table: data,
            room: {
                identifier: roomIdentifier,
                members: {},
                url: url,
                path: `/table/${roomIdentifier}`
            },
        };

        Redis.client.set(roomIdentifier, JSON.stringify(redisData));

        const responseData: IResponseData = {
            transportType: TransportTypeEnum.Socket,
            http: null,
            socket: null,
            body: redisData
        };

        this.socket.emit('app.event.table.created', responseData);
    }
}
