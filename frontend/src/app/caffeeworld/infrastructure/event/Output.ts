import {Injectable} from "@angular/core";
import Socket from "../socket/Socket";
import IOutput from "./IOutput";

@Injectable()
export class Output implements IOutput {
    private readonly createTableEvent = 'app.server.table.create';
    private readonly roomEnteredEvent = 'app.server.room.entered';
    private readonly dataExchangeEvent = 'app.server.room.data_exchange';
    private readonly iceExchangeEvent = 'app.server.room.ice_candidate_exchange';
    private readonly chatMessageEvent = 'app.server.room.chat_message';

    sendCreateTable(data: any): void {
        Socket.table.emit(this.createTableEvent, data);
    }

    sendRoomEntered(data: any): void {
        Socket.room.emit(this.roomEnteredEvent, data);
    }

    sendDataExchange(data: any): void {
        Socket.room.emit(this.dataExchangeEvent, data);
    }

    sendIceExchangeEvent(data: any): void {
        Socket.room.emit(this.iceExchangeEvent, data);
    }

    sendChatMessage(data: any): void {
        Socket.room.emit(this.chatMessageEvent, data);
    }
}
