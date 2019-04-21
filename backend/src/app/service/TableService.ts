import {injectable} from "inversify";
import CreateTable from "../model/CreateTable";
import ISocketMiddlewareResult from "../util/ISocketMiddlewareResult";
import {Socket} from "socket.io";
import Redis from "../../dataSource/redis";
import redis from "../../dataSource/redis";
const uuid = require('uuid/v4');

@injectable()
export default class TableService {
    createTable(socketMiddlewareResult: ISocketMiddlewareResult) {
        const {data, socket} = socketMiddlewareResult;

        const roomIdentifier: string = uuid();

        const url = `${process.env.SITE_URL}/${roomIdentifier}`;

        const redisData = {
            table: data,
            room: {
                url: url,
                path: `/table/${roomIdentifier}`
            },
        };

        Redis.client.set(roomIdentifier, JSON.stringify(redisData));

        socket.join(roomIdentifier);

        socket.emit('app.event.table.created', redisData)
    }
}
