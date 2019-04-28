import ContainerWrapper from "../container/ContainerWrapper";
import {Symbols} from "../container/Symbols";
import TableService from "./service/TableService";
import RoomService from "./service/RoomService";
import {middlewareFactory} from "./util/middlewareFactory";
import {validateTable} from "./util/middleware";
import IceService from "./service/IceService";
import Input from "./event/Input";

export default class SocketFrontController {
    private containerWrapper: ContainerWrapper;

    constructor(
        containerWrapper: ContainerWrapper
    ) {
        this.containerWrapper = containerWrapper;
    }

    initTable() {
        const tableService: TableService = this.containerWrapper.getDependency(Symbols.TableService);
        const input: Input = this.containerWrapper.getDependency(Symbols.Input);

        input.onTableCreate(middlewareFactory([validateTable, tableService.createTable]), tableService);
    }

    initRoom() {
        const roomService: RoomService = this.containerWrapper.getDependency(Symbols.RoomService);
        const iceService: IceService = this.containerWrapper.getDependency(Symbols.IceService);

        const input: Input = this.containerWrapper.getDependency(Symbols.Input);

        input.onRoomEntered(middlewareFactory([roomService.roomEntered]), roomService);
        input.onOfferCreated(middlewareFactory([iceService.onOffer]), iceService);
        input.onIceCandidate(middlewareFactory([iceService.onIceCandidate]), iceService);
    }
}
