import {Injectable} from "@angular/core";
import RoomIdentifier from "../../module/infrastructure/RoomIdentifier";
import Socket from "../socket/Socket";

@Injectable()
export default class IceCandidateEvent {
    private readonly iceCandidateServerEvent = 'app.server.ice.candidate';
    private readonly roomIdentifier: string;

    constructor(
        roomIdentifier: RoomIdentifier
    ) {
        this.roomIdentifier = roomIdentifier.roomIdentifier;
    }

    emitIceCandidate(data) {
        Socket.room.emit(this.iceCandidateServerEvent, data);
    }
}
