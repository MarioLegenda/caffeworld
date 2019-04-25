import {inject, injectable} from "inversify";
import ISocketData from "../util/ISocketData";
import Redis from "../../dataSource/redis";
import {Symbols} from "../../container/Symbols";
import SingletonSocketInstance from "../web/SingletonSocketInstance";

@injectable()
export default class RoomService {
    private socket;
    private readonly maxSessions = 6;
    private readonly sessionUpdateEvent = 'app.events.room.session_updated';

    constructor(
        @inject(Symbols.SingletonSocketInstance) socket: SingletonSocketInstance
    ) {
        this.socket = socket;
    }

    roomEntered(socketMiddlewareResult: ISocketData | any) {
        // data variable is the room identifier in this case
        const {data} = socketMiddlewareResult;

        // see how many users are in this room
        // if there are none, create and add 1
        // if there are some, check if the number of users is lower than 6
        // if it is equal of higher than 6, do nothing
        // if it is lower than 6, add the current user (socket) to the room
        // then, send the app.event.room.user_added event to the client
        Redis.client.get(data, (err, sData: string) => {
            if (err) {
                console.error(`A Redis error occurred with message: ${err.message}`);

                return;
            }

            const sessionData = JSON.parse(sData);

            this.socket.socket.join(data);

            this.socket.io.to(data).emit(this.sessionUpdateEvent, sessionData);
        });
    }
}
