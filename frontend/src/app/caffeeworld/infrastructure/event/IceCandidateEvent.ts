import {Injectable} from "@angular/core";
import SingletonSocketInstance from "./../socket/SingletonSocketInstance";
import RoomIdentifier from "../../module/infrastructure/RoomIdentifier";

@Injectable()
export default class IceCandidateEvent {
    private socket;

    private readonly iceCandidateServerEvent = 'app.server.ice.candidate';
    private readonly roomIdentifier: string;

    constructor(
        socket: SingletonSocketInstance,
        roomIdentifier: RoomIdentifier
    ) {
        this.socket = socket.socket;
        this.roomIdentifier = roomIdentifier.roomIdentifier;
    }

    emitIceCandidate(data) {
        this.socket.emit(this.iceCandidateServerEvent, data);
    }
}
