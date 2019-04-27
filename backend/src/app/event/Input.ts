import Socket from "../web/Socket";
import {injectable} from "inversify";

@injectable()
export default class Output {
    private readonly createTableEvent: string = 'app.server.table.create';

    onTableCreate(middlewareImpl?: Function | null, context?: object): void {
        Socket.socket.on(this.createTableEvent, (data) => middlewareImpl(data, (context) ? context : this));
    }
}
