import {Component} from '@angular/core';
import CreateTableModel from '../../infrastructure/model/CreateTableModel';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ClipboardService} from "ngx-clipboard";
import IResponseData from "../../infrastructure/web/IResponseData";
import {TableService} from "../../infrastructure/service/TableService";
import Socket from "../../infrastructure/socket/Socket";

@Component({
    selector: 'app-create-room',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
    providers: [
    ]
})
export class CreateComponent {
    createTableModel: CreateTableModel = new CreateTableModel();
    formDisabled = true;
    roomData = null;
    copied = false;

    constructor(
        private tableService: TableService,
        private modalService: NgbModal,
        private clipboardService: ClipboardService
    ) {}

    onSubmit(isValid: boolean, content) {
        if (isValid) {
            Socket.table.on('connect', () => {
                this.tableService.onTableCreated((data: IResponseData) => {
                    this.roomData = data.body;
                    this.modalService.open(content);
                });

                this.tableService.createTable(this.createTableModel);
            });
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
