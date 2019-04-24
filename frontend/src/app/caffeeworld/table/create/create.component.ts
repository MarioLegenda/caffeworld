import {Component, Input, OnDestroy, Output} from '@angular/core';
import CreateTableModel from '../../infrastructure/model/CreateTableModel';
import {TableSocketService} from "../../infrastructure/TableSocketService";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ClipboardService} from "ngx-clipboard";

@Component({
    selector: 'app-create-room',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnDestroy {
    createTableModel: CreateTableModel = new CreateTableModel();
    formDisabled = true;
    roomData = null;
    copied = false;

    constructor(
        private tableSocketService: TableSocketService,
        private modalService: NgbModal,
        private clipboardService: ClipboardService
    ) {}

    onSubmit(isValid: boolean, content) {
        if (isValid) {
            this.tableSocketService.onTableCreated((data) => {
                this.roomData = data;
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

    ngOnDestroy(): void {
        this.tableSocketService.unsubscribe();
    }
}
