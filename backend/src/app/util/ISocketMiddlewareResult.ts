import {Socket} from "socket.io";

export default interface ISocketMiddlewareResult {
    data: any;
    socket: Socket
}
