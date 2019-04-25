import * as SocketIO from "socket.io";

export default class SingletonSocketInstance {
    private readonly socketIO: SocketIO.Server;

    constructor(socket) {
        this.socketIO = socket;
    }

    get socket(): SocketIO.Server {
        return this.socketIO;
    }
}
