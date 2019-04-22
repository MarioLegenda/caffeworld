import {inject, injectable} from "inversify";
import {Socket} from "socket.io";
import {Symbols} from "../../container/Symbols";
import {Observable, Subject} from "rxjs";
import ObservableFactory from "../util/ObservableFactory";

@injectable()
export default class RoomEvent {
    private observableFactory;

    private readonly createTableEvent = 'app.event.room.entered';

    constructor(
        @inject(Symbols.ObservableFactory) observableFactory: ObservableFactory
    ) {
        this.observableFactory = observableFactory;
    }

    onRoomEntered(socket: Socket, middlewareImpl?: Function | null): Observable<object> {
        const subject: Subject<any> = this.observableFactory.createAndGetObservable(this.createTableEvent);

        socket.on(this.createTableEvent, (data) => {
            const middlewareData = middlewareImpl(data);

            subject.next({data: middlewareData.data, socket: socket});
        });

        return this.observableFactory.getObservable(this.createTableEvent);
    }

    flushEvents() {
        this.observableFactory.unsubscribe();
    }
}
