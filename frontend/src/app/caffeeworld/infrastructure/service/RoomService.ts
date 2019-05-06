import {Output} from '../event/Output';
import {RoomIdentifier} from "../../module/infrastructure/RoomIdentifier";
import {Injectable} from "@angular/core";
import Socket from "../socket/Socket";
import {Input} from "../event/Input";

@Injectable()
export class RoomService {
    constructor(
        private output: Output,
        private input: Input,
        private roomIdentifier: RoomIdentifier,
    ) {}

    handleEnteringRoom(): void {
        this.output.sendRoomEntered({
            roomIdentifier: this.roomIdentifier.roomIdentifier,
            memberIdentifier: Socket.roomId,
        });
    }

    roomUpdated(subscriber, context?: object): void {
        this.input.onRoomUpdated(subscriber, context);
    }

    roomLeave(subscriber, context?: object): void {
        this.input.onRoomLeave(subscriber, context);
    }


}
