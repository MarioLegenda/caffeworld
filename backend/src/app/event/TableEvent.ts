import {inject, injectable} from "inversify";
import {Symbols} from "../../container/Symbols";
import SingletonSocketInstance from "../web/SingletonSocketInstance";
import Socket from "../web/Socket";

@injectable()
export default class TableEvent {
    private socket;

    private readonly createTableEvent = 'app.server.table.create';

    constructor(
        @inject(Symbols.SingletonSocketInstance) socket: SingletonSocketInstance
    ) {
        this.socket = socket.socket;
    }

    onTableCreate(middlewareImpl?: Function | null, context?: object): void {
        Socket.socket.on(this.createTableEvent, (data) => middlewareImpl(data, (context) ? context : this));
    }
}
