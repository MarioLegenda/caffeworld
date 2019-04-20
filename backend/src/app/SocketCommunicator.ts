import {app} from '../../app';
import {injectable} from "inversify";
const io = require("socket.io")(app.http, { pingTimeout: 60000, path: '/socket' });

@injectable()
export default class SocketCommunicator {
    onConnect(callback: Function) {
        io.on('connection', callback);
    }

    onDisconnect(callback: Function) {
        io.on('disconnect', callback);
    }
}
