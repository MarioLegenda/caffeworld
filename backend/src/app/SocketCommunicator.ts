import {app} from '../../app';
import {injectable} from "inversify";
const io = require("socket.io")(app.http, { pingTimeout: 10, path: '/socket' });

@injectable()
export default class SocketCommunicator {
    onConnect(callback: Function) {
        io.on('connection', callback);
    }
}
