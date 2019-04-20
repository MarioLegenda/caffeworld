import {inject, injectable} from "inversify";
import {Socket} from "socket.io";
import {Symbols} from "../../container/Symbols";
import {Observable} from "rxjs";
import ObservableFactory from "../util/ObservableFactory";

@injectable()
export default class TableEvent {
    private observableFactory;

    private readonly createTableEvent = 'app.event.table.create';

    constructor(
        @inject(Symbols.ObservableFactory) observableFactory: ObservableFactory
    ) {
        this.observableFactory = observableFactory;
    }

    onTableCreate(socket: Socket): Observable<object> {
        const subject = this.observableFactory.createAndGetObservable(this.createTableEvent);

        socket.on(this.createTableEvent, (data) => {
            subject.next(data);
        });

        return this.observableFactory.getObservable(this.createTableEvent);
    }

    flushEvents() {
        this.observableFactory.unsubscribe();
    }
}
