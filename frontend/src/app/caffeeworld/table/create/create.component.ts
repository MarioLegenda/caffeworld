import {Component} from '@angular/core';
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
        private tableSocketService: TableSocketService
    ) {}

    onSubmit(isValid: boolean) {
        if (isValid) {
            this.tableSocketService.emitCreateTable(this.createTableModel);
        }
    }
}
