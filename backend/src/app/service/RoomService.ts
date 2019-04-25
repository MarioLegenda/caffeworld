import {inject, injectable} from "inversify";
import ISocketData from "../util/ISocketData";
import Redis from "../../dataSource/redis";
import IResponseData from "../web/IResponseData";
import {TransportTypeEnum} from "../web/TrasportTypeEnum";
import {Symbols} from "../../container/Symbols";
import SingletonSocketInstance from "../web/SingletonSocketInstance";

@injectable()
export default class RoomService {
    private socket;

    constructor(
        @inject(Symbols.SingletonSocketInstance) socket: SingletonSocketInstance
    ) {
        this.socket = socket.socket;
    }

    roomEntered(socketMiddlewareResult: ISocketData | any) {
        // data variable is the room identifier in this case
        const {data, socket} = socketMiddlewareResult;
        const max = 6;

        const sessionUpdateEvent = 'app.events.room.session_updated';

        // see how many users are in this room
        // if there are none, create and add 1
        // if there are some, check if the number of users is lower than 6
        // if it is equal of higher than 6, do nothing
        // if it is lower than 6, add the current user (socket) to the room
        // then, send the app.event.room.user_added event to the client
        Redis.client.get(data, (err, sessionData: string) => {
            if (err) {
                console.error(`An error occurred with message: ${err.message}`);

                return;
            }

            const sData = JSON.parse(sessionData);
            const room = sData.room;

            console.log(`Client data fetched: ${sessionData}`);

            if (!room.hasOwnProperty('sessions')) {
                console.log('Client has no sessions. Session is set to 1');
                room['sessions'] = 1;

                sData.room = room;

                Redis.client.set(data, JSON.stringify(sData));

                console.log(`${sessionUpdateEvent} is sent to the client`);

                const responseData: IResponseData = {
                    transportType: TransportTypeEnum.Socket,
                    http: null,
                    socket: null,
                    body: sData
                };

                this.socket.emit(sessionUpdateEvent, responseData);
            } else if (room.hasOwnProperty('sessions')) {
                console.log(`Redis has session property: ${room.sessions}`);

                if (room.sessions >= max) {
                    console.log(`Max number of sessions reached. Sending app.event.error`);
                    socket.emit('app.event.error');

                    return;
                }

                room.sessions += 1;

                sData.room = room;

                const responseData: IResponseData = {
                    transportType: TransportTypeEnum.Socket,
                    http: null,
                    socket: null,
                    body: sData
                };

                console.log(`Emitting ${sessionUpdateEvent}`);

                this.socket.emit(sessionUpdateEvent, responseData);
            }
        });
    }
}