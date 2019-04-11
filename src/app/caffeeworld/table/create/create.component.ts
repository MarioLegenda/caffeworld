import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-create-room',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
    invitations = [];
    invitationsNum = [0];

    addInvitationField() {
        if (this.invitationsNum.length < 5) {
            this.invitationsNum.push(0);
        }
    }
}
