import {Component, EventEmitter, Output} from '@angular/core';
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

    @Output() open: EventEmitter<any> = new EventEmitter();

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
            this.createTableModel.invitations = this.invitationService.asArray;
            // @ts-ignore
            this.tableSocketService.emitCreateTable(this.createTableModel).subscribe((data) => {

            })
        }
    }
}
