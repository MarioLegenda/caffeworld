import Output from '../event/Output';
import RoomIdentifier from "../../module/infrastructure/RoomIdentifier";
import {Injectable} from "@angular/core";
import Socket from "../socket/Socket";
import IInput from "../event/IInput";
import {Input} from "../event/Input";
import IOutput from "../event/IOutput";

@Injectable()
export default class RoomService {
    private readonly input: IInput;
    private readonly output: IOutput;
    private readonly roomIdentifier: RoomIdentifier;

    constructor(
        output: Output,
        input: Input,
        roomIdentifier: RoomIdentifier,
    ) {
        this.input = input as IInput;
        this.output = output as IOutput;
        this.roomIdentifier = roomIdentifier;
    }

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
