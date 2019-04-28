import {environment} from "../../../../environments/environment";
import io from 'socket.io-client';

export default class Socket {
    private static tableNamespace;
    private static roomNamespace;

    static get table() {
        if (!Socket.tableNamespace) {
            Socket.tableNamespace = io(
                environment.siteUrl + '/table',
                {path: '/socket', reconnectionAttempts: 5}
            )
        }

        return Socket.tableNamespace;
    }

    static get room() {
        if (!Socket.roomNamespace) {
            Socket.roomNamespace = io(
                environment.siteUrl + '/room',
                {path: '/socket', reconnectionAttempts: 5}
            )
        }

        return Socket.roomNamespace;
    }

    static get roomId(): string {
        return Socket.room.id;
    }

    static get tableId(): string {
        return Socket.table.id;
    }
}
