import {Component, OnInit, ViewChild} from '@angular/core';
import {Output} from "../../../../infrastructure/event/Output";
import {Input} from "../../../../infrastructure/event/Input";
import {RoomIdentifier} from "../../../infrastructure/RoomIdentifier";

@Component({
    selector: 'app-chat-box',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
    message = '';

    @ViewChild('contentElem') contentElem;

    messages = [];

    constructor(
        private output: Output,
        private input: Input,
        private roomIdentifier: RoomIdentifier
    ) {}

    ngOnInit() {
        this.input.onChatMessage((data) => {
            const body = data.body;

            this.messages.push({
                msg: body.message,
                'class': 'incoming-message',
            });
        });
    }

    onSend() {
        if (this.message.length === 0) {
            return;
        }

        this.messages.push({
            msg: this.message,
            'class': 'outgoing-message',
        });

        this.output.sendChatMessage({
            roomIdentifier: this.roomIdentifier.roomIdentifier,
            message: this.message
        });

        this.message = '';

        this.contentElem.nativeElement.scrollTop = this.contentElem.nativeElement.scrollHeight;
    }
}
