import {Socket} from "socket.io";

export default interface ISocketData {
    data: any;
    socket: Socket
}
