import {Socket} from "socket.io";
import Redis from "../dataSource/redis";
const uuid = require('uuid/v4');

export function onCreateTable(data: object) {
    const identifier: string = uuid();

    Redis.client.set(identifier, JSON.stringify(data));


}

export function onSocketConnect(socket: Socket) {

    console.log('Socket connection established');

    socket.on('app.table.create', onCreateTable);

    socket.on('disconnect', onSocketDisconnect);
}

export function onSocketDisconnect() {
    console.log('Socket disconnected');
}
