import {inject, injectable} from "inversify";
import Redis from "../../dataSource/redis";
import IData from "../util/IData";
import {Symbols} from "../../container/Symbols";
import IOutput from "../event/IOutput";

const uuid = require('uuid/v4');

@injectable()
export default class TableService {
    private output: IOutput;

    constructor(
        @inject(Symbols.Output) output: IOutput
    ) {
        this.output = output;
    }

    createTable(d: IData): void {
        const {data} = d;

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

        Redis.client.set(roomIdentifier, JSON.stringify(redisData));

        this.output.createTable(redisData);
    }
}
