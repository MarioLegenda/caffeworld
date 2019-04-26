import {inject, injectable} from "inversify";
import ISocketData from "../util/ISocketData";
import Redis from "../../dataSource/redis";
import {Symbols} from "../../container/Symbols";
import SingletonSocketInstance from "../web/SingletonSocketInstance";
import IResponseData from "../web/IResponseData";
import {TransportTypeEnum} from "../web/TrasportTypeEnum";

@injectable()
export default class RoomService {
    private socket;
    private readonly maxSessions = 6;
    private readonly sessionUpdateEvent = 'app.client.room.session_updated';
    private readonly sessionUpdateError = 'app.server.room.error.session_updated';
    private readonly internalRoomLinks: string = 'app.internal.roomLinks';
    private readonly internalError: string = 'app.internal.error';

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
        Redis.client.get(data.identifier, (err, sData: string) => {
            if (err) {
                console.error(`A Redis error occurred with message: ${err.message}`);

                return;
            }

            const roomIdentifier = data.identifier;
            const memberIdentifier = data.memberIdentifier;

            (function(socket, socketId: string, roomLinksName: string, errorName: string) {
                Redis.client.get(roomLinksName, (err, reply) => {
                    if (err) {
                        return socket.emit(errorName);
                    }

                    let roomLinks = JSON.parse(reply);

                    if (!roomLinks) {
                        roomLinks = {};
                    }

                    console.log(roomLinks);
                    if (socketId in roomLinks === false) {
                        roomLinks[socketId] = roomIdentifier;

                        Redis.client.set(roomLinksName, JSON.stringify(roomLinks));
                    }
                });
            })(this.socket.socket, this.socket.socket.id, this.internalRoomLinks, this.internalError);

            const sessionData = JSON.parse(sData);

            const responseData: IResponseData = {
                transportType: TransportTypeEnum.Socket,
                http: null,
                socket: null,
                body: null,
            };

            const members = sessionData.room.members;

            // a new member has joined this room
            if (memberIdentifier in members === false) {
                sessionData.room.members[memberIdentifier] = memberIdentifier;
            }

            if (members.count === 6) {
                return this.socket.io.to(data).emit(this.sessionUpdateError);
            }

            Redis.client.set(roomIdentifier, JSON.stringify(sessionData));

            this.socket.socket.join(roomIdentifier);
            this.socket.io.to(roomIdentifier).emit(this.sessionUpdateEvent, sessionData);
        });
    }

    memberLeft(socketMiddlewareResult: ISocketData | any) {
        // in this case, data is the socket id of the connection that left
        const {data} = socketMiddlewareResult;

        console.log('ulazak');
        console.log(data);
    }
}
