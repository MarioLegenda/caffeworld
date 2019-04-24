import {Component} from '@angular/core';
import CreateTableModel from '../../infrastructure/model/CreateTableModel';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ClipboardService} from "ngx-clipboard";
import {CreateTableEvent} from "../../infrastructure/event/CreateTableEvent";
import IResponseData from "../../infrastructure/web/IResponseData";

@Component({
    selector: 'app-create-room',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
    createTableModel: CreateTableModel = new CreateTableModel();
    formDisabled = true;
    roomData = null;
    copied = false;

    constructor(
        private tableSocketService: CreateTableEvent,
        private modalService: NgbModal,
        private clipboardService: ClipboardService
    ) {}

    onSubmit(isValid: boolean, content) {
        if (isValid) {
            this.tableSocketService.onTableCreated((data: IResponseData) => {
                this.roomData = data.body;
                this.modalService.open(content);
            });

            this.tableSocketService.emitCreateTable(this.createTableModel);
        }
    }

    goToTable(url) {
        (window as any).location.href = url;
    }

    onCopy() {
        this.copied = true;

        this.clipboardService.copyFromContent(this.roomData.room.url);
    }
}
