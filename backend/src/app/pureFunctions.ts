import Redis from "../dataSource/redis";
import {TransportTypeEnum} from "./web/TrasportTypeEnum";
import IResponseData from "./web/IResponseData";
import {promisify} from "util";

const uuid = require('uuid/v4');

const getAsync = promisify(Redis.client.get).bind(Redis.client);

export async function onRoomEntered(socket, roomNamespace, data) {
    const roomIdentifier = data.identifier;

    const sData = await getAsync(roomIdentifier);

    (async function (socket, socketId: string, roomIdentifier: string, roomLinksName: string) {
        const reply = await getAsync(roomLinksName);
        
        let roomLinks = JSON.parse(reply);

        if (!roomLinks) {
            roomLinks = {};
        }

        if (socketId in roomLinks === false) {
            roomLinks[socketId] = roomIdentifier;

            Redis.client.set(roomLinksName, JSON.stringify(roomLinks));
        }
    })(
        socket,
        socket.id,
        roomIdentifier,
        'app.internal.room_links'
    );

    const sessionData = JSON.parse(sData);

    const members = sessionData.room.members;

    members.list = Object.keys(roomNamespace.sockets);
    members.count = Object.keys(roomNamespace.sockets).length;

    if (members.count > 1) {
        members.new_member = socket.id;
    }

    sessionData.room.members = members;

    if (members.count >= this.maxSessions) {
        return roomNamespace.to(data).emit(this.sessionUpdateError);
    }

    Redis.client.set(roomIdentifier, JSON.stringify(sessionData));

    socket.join(roomIdentifier, () => {
        roomNamespace.to(roomIdentifier).emit('app.client.room.room_updated', createResponseData(sessionData, TransportTypeEnum.Socket));
    });
}

export function onDataExchange(socket, data) {
    socket.broadcast.to(data.roomIdentifier).emit('app.client.room.data_exchange', createResponseData(data, TransportTypeEnum.Socket));
}

export function onIceCandidateExchange(socket, data) {
    socket.broadcast.to(data.roomIdentifier).emit('app.client.room.ice_candidate_exchange', createResponseData(data, TransportTypeEnum.Socket));
}

export function createResponseData(data: any, transportType: TransportTypeEnum): IResponseData {
    return {
        transportType: transportType,
        http: null,
        socket: null,
        body: data,
    };
}

export function createTable(socket, data) {
    const roomIdentifier: string = uuid();

    const url = `${process.env.SITE_URL}/table/${roomIdentifier}`;

    const redisData = {
        table: data,
        room: {
            identifier: roomIdentifier,
            members: {
                list: [],
                count: 0,
                new_member: null,
            },
            url: url,
            path: `/table/${roomIdentifier}`
        },
    };

    Redis.client.set(roomIdentifier, JSON.stringify(redisData));

    socket.emit('app.client.table.created', createResponseData(redisData, TransportTypeEnum.Socket));
}

export async function onDisconnect(socket, roomNamespace) {
    const socketId = socket.id;

    try {
        const links = JSON.parse(await getAsync('app.internal.room_links'));

        if (socketId in links) {
            const roomIdentifier = links[socketId];

            let tableData = JSON.parse(await getAsync(roomIdentifier));

            const members = tableData.room.members;

            members.list.splice(members.list.indexOf(socketId), 1);
            members.count = members.list.count();
            members.new_member = null;

            tableData.room.members = members;

            Redis.client.set(roomIdentifier, JSON.stringify(tableData));

            socket.leave(roomIdentifier);

            roomNamespace.to(roomIdentifier).emit('app.client.room.room_updated', createResponseData(tableData, TransportTypeEnum.Socket));
        }
    } catch (err) {
        throw new Error(`Error occurred on socket disconnect with message: ${err.message}`);
    }

    console.log('Room namespace has disconnected');
}
