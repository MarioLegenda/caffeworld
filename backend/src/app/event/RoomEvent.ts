import {inject, injectable} from "inversify";
import {Socket} from "socket.io";
import {Symbols} from "../../container/Symbols";
import {Observable, Subject} from "rxjs";
import ObservableFactory from "../util/ObservableFactory";

@injectable()
export default class RoomEvent {
    private observableFactory;

    private readonly roomEnteredEvent = 'app.events.room.entered';

    constructor(
        @inject(Symbols.ObservableFactory) observableFactory: ObservableFactory
    ) {
        this.observableFactory = observableFactory;
    }

    onRoomEntered(socket: Socket, middlewareImpl?: Function | null): Observable<object> {
        const subject: Subject<any> = this.observableFactory.createAndGetObservable(this.roomEnteredEvent);

        socket.on(this.roomEnteredEvent, (data) => {
            if (middlewareImpl) {
                data = middlewareImpl(data);
            }

            subject.next({data: data, socket: socket});
        });

        return this.observableFactory.getObservable(this.roomEnteredEvent);
    }

    flushEvents() {
        this.observableFactory.unsubscribe();
    }
}
