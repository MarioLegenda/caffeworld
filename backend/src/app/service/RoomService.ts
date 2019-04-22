import {injectable} from "inversify";
import ISocketMiddlewareResult from "../util/ISocketMiddlewareResult";
import Redis from "../../dataSource/redis";
const uuid = require('uuid/v4');

@injectable()
export default class RoomService {
    roomEntered(socketMiddlewareResult: ISocketMiddlewareResult | any) {
        const {identifier, socket} = socketMiddlewareResult;
        const max = 6;

        // see how many users are in this room
        // if there are none, create and add 1
        // if there are some, check if the number of users is lower than 6
        // if it is equal of higher than 6, do nothing
        // if it is lower than 6, add the current user (socket) to the room
        // then, send the app.event.room.user_added event to the client
        Redis.client.get(identifier, function(err, sessionData: string) {
            if (err) {
                console.error(`An error occurred with message: ${err.message}`);

                return;
            }

            const sData = JSON.parse(sessionData);
            const room = sData.room;

            if (!room.hasOwnProperty('sessions')) {
                room['sessions'] = 1;

                sData.room = room;

                Redis.client.set(identifier, JSON.stringify(sData));

                socket.join(identifier);

                socket.emit('app.events.room.session_updated', sData);
            }

            if (room.hasOwnProperty('sessions')) {
                if (room.sessions >= max) socket.emit('app.events.room.max_session_reached');
            }
        });
    }
}
