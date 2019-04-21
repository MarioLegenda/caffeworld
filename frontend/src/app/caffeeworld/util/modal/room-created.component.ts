import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Component, Input} from "@angular/core";

export class ModalContent {
    @Input() name;

    constructor(public activeModal: NgbActiveModal) {}
}

@Component({
    selector: 'room-created-modal',
    templateUrl: './room-created.component.html'
})
export class RoomCreatedComponent {
    constructor(private modalService: NgbModal) {}

    open() {
        const modalRef = this.modalService.open(ModalContent);
        modalRef.componentInstance.name = 'World';
    }
}
