import {Component, EventEmitter, Output} from '@angular/core';
import InvitationService from './service/InvitationService';
import CreateTableModel from '../model/CreateTableModel';

@Component({
    selector: 'app-create-room',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
    createTableModel: CreateTableModel = new CreateTableModel();
    formDisabled = true;

    @Output() open: EventEmitter<any> = new EventEmitter();

    constructor(private invitationService: InvitationService) {
        this.invitationService.clear();
        this.invitationService.init(1);
    }

    addInvitationField() {
        this.invitationService.update();
    }

    onSubmit(isValid: boolean) {
        if (isValid) {
            this.createTableModel.invitations = this.invitationService.asArray;

            console.log(this.createTableModel);
        }
    }

    get debugging() {
        return JSON.stringify(this.createTableModel);
    }
}
