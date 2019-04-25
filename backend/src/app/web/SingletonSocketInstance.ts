import * as SocketIO from "socket.io";

export default class SingletonSocketInstance {
    public readonly socket: SocketIO.Server;
    public readonly io;

    constructor(io, socket) {
        this.socket = socket;
        this.io = io;
    }
}
