import {inject, injectable} from "inversify";
import Redis from "../../dataSource/redis";
import ISocketData from "../util/ISocketData";
import IResponseData from "../web/IResponseData";
import {TransportTypeEnum} from "../web/TrasportTypeEnum";
import Socket from "../web/Socket";
import {Symbols} from "../../container/Symbols";
import Output from "../event/Output";

const uuid = require('uuid/v4');

@injectable()
export default class TableService {
    private output: Output;

    constructor(
        @inject(Symbols.Output) output: Output
    ) {
        this.output = output;
    }

    createTable(socketMiddlewareResult: ISocketData): void {
        const {data} = socketMiddlewareResult;

        const roomIdentifier: string = uuid();

        const url = `${process.env.SITE_URL}/table/${roomIdentifier}`;

        const redisData = {
            table: data,
            room: {
                identifier: roomIdentifier,
                members: {
                    list: [],
                    count: 0,
                },
                url: url,
                path: `/table/${roomIdentifier}`
            },
        };

        console.log(redisData);

        Redis.client.set(roomIdentifier, JSON.stringify(redisData));

        this.output.createTable(redisData);
    }
}
