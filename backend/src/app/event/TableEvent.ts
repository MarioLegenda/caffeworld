import {inject, injectable} from "inversify";
import {Symbols} from "../../container/Symbols";
import SingletonSocketInstance from "../web/SingletonSocketInstance";

@injectable()
export default class TableEvent {
    private socket;

    private readonly createTableEvent = 'app.event.table.create';

    constructor(
        @inject(Symbols.SingletonSocketInstance) socket: SingletonSocketInstance
    ) {
        this.socket = socket.socket;
    }

    onTableCreate(middlewareImpl?: Function | null, context?: object): void {
        this.socket.on(this.createTableEvent, (data) => middlewareImpl(data, (context) ? context : this));
    }
}
