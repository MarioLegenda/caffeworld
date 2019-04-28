import Output from '../event/Output';
import RoomIdentifier from "../../module/infrastructure/RoomIdentifier";
import {Injectable} from "@angular/core";
import Socket from "../socket/Socket";

@Injectable()
export default class RoomService {
    constructor(
        private output: Output,
        private roomIdentifier: RoomIdentifier,
    ) {}

    handleEnteringRoom(): void {
        this.output.sendRoomEntered({
            roomIdentifier: this.roomIdentifier.roomIdentifier,
            memberIdentifier: Socket.room.id,
        });
    }
}
