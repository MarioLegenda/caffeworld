import {inject, injectable} from "inversify";
import IData from "../util/IData";
import Redis from "../../dataSource/redis";
import Socket from "../web/Socket";
import {Symbols} from "../../container/Symbols";
import IOutput from "../event/IOutput";

@injectable()
export default class RoomService {
    private readonly maxSessions = 6;
    private readonly sessionUpdateError = 'app.server.room.error.session_updated';
    private readonly internalRoomLinks: string = 'app.internal.room_links';
    private readonly internalError: string = 'app.internal.error';

    private output: IOutput;

    constructor(@inject(Symbols.Output) output: IOutput) {
        this.output = output;
    }

    roomEntered(d: IData | any) {
        // data variable is the room identifier in this case
        const {data} = d;

        const roomIdentifier = data.roomIdentifier;

        Redis.client.get(roomIdentifier, (err, sData: string) => {
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

            const members = sessionData.room.members;

            members.list = Object.keys(Socket.namespace.sockets);
            members.count = Object.keys(Socket.namespace.sockets).length;

            sessionData.room.members = members;

            if (members.count >= this.maxSessions) {
                return Socket.namespace.to(data).emit(this.sessionUpdateError);
            }

            Redis.client.set(roomIdentifier, JSON.stringify(sessionData));

            Socket.socket.join(roomIdentifier);

            this.output.sendUpdateRoom(roomIdentifier, sessionData);
        });
    }
}
