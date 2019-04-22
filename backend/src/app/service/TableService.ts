import {injectable} from "inversify";
import Redis from "../../dataSource/redis";
import ISocketData from "../util/ISocketData";
const uuid = require('uuid/v4');

@injectable()
export default class TableService {
    createTable(socketMiddlewareResult: ISocketData) {
        const {data, socket} = socketMiddlewareResult;

        const roomIdentifier: string = uuid();

        const url = `${process.env.SITE_URL}/table/${roomIdentifier}`;

        const redisData = {
            table: data,
            room: {
                url: url,
                path: `/table/${roomIdentifier}`
            },
        };

        Redis.client.set(roomIdentifier, JSON.stringify(redisData));

        socket.emit('app.event.table.created', redisData)
    }
}
