import ContainerWrapper from "../container/ContainerWrapper";
import TableEvent from "./event/TableEvent";
import {Symbols} from "../container/Symbols";
import RoomEvent from "./event/RoomEvent";
import TableService from "./service/TableService";
import RoomService from "./service/RoomService";
import {middlewareFactory} from "./util/middlewareFactory";
import {validateTable} from "./util/middleware";

export default class SocketFrontController {
    private containerWrapper: ContainerWrapper;

    constructor(
        containerWrapper: ContainerWrapper
    ) {
        this.containerWrapper = containerWrapper;
    }

    initApp() {
        console.log('ulazak');
        const tableEvent: TableEvent = this.containerWrapper.getDependency(Symbols.TableEvent);
        const roomEvent: RoomEvent = this.containerWrapper.getDependency(Symbols.RoomEvent);
        const tableService: TableService = this.containerWrapper.getDependency(Symbols.TableService);
        const roomService: RoomService = this.containerWrapper.getDependency(Symbols.RoomService);

        tableEvent.onTableCreate(middlewareFactory([validateTable, tableService.createTable]));
        roomEvent.onRoomEntered(middlewareFactory([roomService.roomEntered]));
    }
}
