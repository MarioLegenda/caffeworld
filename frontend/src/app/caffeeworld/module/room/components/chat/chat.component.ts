import {Component} from '@angular/core';
import Output from "../../../../infrastructure/event/Output";

@Component({
    selector: 'app-chat-box',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
    message = '';
    constructor(private output: Output) {}

    onSend() {
        if (this.message.length === 0) {
            return;
        }

        console.log(this.message);

        this.output.sendChatMessage(this.message);
    }
}
