import {Component} from '@angular/core';
import InvitationService from './service/InvitationService';
import CreateTableModel from '../../infrastructure/model/CreateTableModel';
import {TableSocketService} from "../../infrastructure/TableSocketService";

@Component({
    selector: 'app-create-room',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
    createTableModel: CreateTableModel = new CreateTableModel();
    formDisabled = true;

    constructor(
        private invitationService: InvitationService,
        private tableSocketService: TableSocketService
    ) {
        this.invitationService.clear();
        this.invitationService.init(1);
    }

    addInvitationField() {
        this.invitationService.update();
    }

    onSubmit(isValid: boolean) {
        if (isValid) {
            this.tableSocketService.emitCreateTable(this.createTableModel);
        }
    }
}
