import {Socket} from "socket.io";
import Redis from "../dataSource/redis";
const uuid = require('uuid/v4');

export function onCreateTable(data: object, cb: Function) {
    const identifier: string = uuid();

    Redis.client.set(identifier, JSON.stringify(data));

    process.nextTick(cb);
}

export function onSocketConnect(socket: Socket) {
    socket.on('disconnect', onSocketDisconnect);
}

export function onSocketDisconnect() {

}
