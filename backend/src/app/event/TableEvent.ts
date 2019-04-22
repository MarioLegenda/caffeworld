import {inject, injectable} from "inversify";
import {Socket} from "socket.io";
import {Symbols} from "../../container/Symbols";
import {Observable, Subject} from "rxjs";
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

    onTableCreate(socket: Socket, middlewareImpl?: Function | null): Observable<object> {
        const subject: Subject<any> = this.observableFactory.createAndGetObservable(this.createTableEvent);

        socket.on(this.createTableEvent, (data) => {
            if (middlewareImpl) {
                data = middlewareImpl(data).data;
            }

            subject.next({data: data, socket: socket});
            subject.complete();
        });

        return this.observableFactory.getObservable(this.createTableEvent);
    }

    flushEvents() {
        this.observableFactory.unsubscribe();
    }
}
