import { Component, OnInit } from '@angular/core';
import InvitationService from './service/InvitationService';

@Component({
    selector: 'app-create-room',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
    constructor(private invitationService: InvitationService) {
        this.invitationService.init(1);
    }

    addInvitationField() {
        this.invitationService.update();
    }
}
