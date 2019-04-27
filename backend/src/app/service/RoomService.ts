import {inject, injectable} from "inversify";
import ISocketData from "../util/ISocketData";
import Redis from "../../dataSource/redis";
import {Symbols} from "../../container/Symbols";
import SingletonSocketInstance from "../web/SingletonSocketInstance";
import IResponseData from "../web/IResponseData";
import {TransportTypeEnum} from "../web/TrasportTypeEnum";
import Socket from "../web/Socket";

@injectable()
export default class RoomService {
    private socket;
    private readonly maxSessions = 6;
    private readonly sessionUpdateEvent = 'app.client.room.session_updated';
    private readonly sessionUpdateError = 'app.server.room.error.session_updated';
    private readonly internalRoomLinks: string = 'app.internal.room_links';
    private readonly internalError: string = 'app.internal.error';

    constructor(
        @inject(Symbols.SingletonSocketInstance) socket: SingletonSocketInstance
    ) {
        this.socket = socket;
    }

    roomEntered(socketMiddlewareResult: ISocketData | any) {
        // data variable is the room identifier in this case
        const {data} = socketMiddlewareResult;

        const roomIdentifier = data.identifier;

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

            (function(socket, socketId: string, roomIdentifier: string, roomLinksName: string, errorName: string) {
                Redis.client.get(roomLinksName, (err, reply) => {
                    if (err) {
                        return socket.emit(errorName);
                    }

                    let roomLinks = JSON.parse(reply);

                    if (!roomLinks) {
                        roomLinks = {};
                    }

                    if (socketId in roomLinks === false) {
                        roomLinks[socketId] = roomIdentifier;

                        Redis.client.set(roomLinksName, JSON.stringify(roomLinks));
                    }
                });
            })(
                Socket.socket,
                Socket.socket.id,
                roomIdentifier,
                this.internalRoomLinks,
                this.internalError
            );

            const sessionData = JSON.parse(sData);

            const responseData: IResponseData = {
                transportType: TransportTypeEnum.Socket,
                http: null,
                socket: null,
                body: null,
            };

            const members = sessionData.room.members;

            members.list = Object.keys(Socket.namespace.sockets);
            members.count = Object.keys(Socket.namespace.sockets).length;

            sessionData.room.members = members;

            if (members.count >= this.maxSessions) {
                return Socket.namespace.to(data).emit(this.sessionUpdateError);
            }

            Redis.client.set(roomIdentifier, JSON.stringify(sessionData));

            responseData.body = sessionData;

            Socket.socket.join(roomIdentifier);

            Socket.namespace.to(roomIdentifier).emit(this.sessionUpdateEvent, responseData);
        });
    }
}
