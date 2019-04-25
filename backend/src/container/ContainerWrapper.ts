import {Container} from "inversify";
import {Symbols} from "./Symbols";
import TableEvent from "../app/event/TableEvent";
import TableService from "../app/service/TableService";
import RoomEvent from "../app/event/RoomEvent";
import RoomService from "../app/service/RoomService";
import * as SocketIO from "socket.io";
import SingletonSocketInstance from "../app/web/SingletonSocketInstance";

export default class ContainerWrapper {
    private readonly inversify: Container;

    private containerInit = false;

    private readonly containers = [
        {
            name: 'root',
            bound: false,
            init: (socket) => {
                this.inversify.bind<TableService>(Symbols.TableService).to(TableService);
                this.inversify.bind<RoomService>(Symbols.RoomService).to(RoomService);
            }
        },
        {
            name: 'socketSpecific',
            bound: false,
            init: (socket) => {
                this.inversify.bind<SingletonSocketInstance>(Symbols.SingletonSocketInstance).toDynamicValue(() => new SingletonSocketInstance(socket));
                this.inversify.bind<TableEvent>(Symbols.TableEvent).to(TableEvent);
                this.inversify.bind<RoomEvent>(Symbols.RoomEvent).to(RoomEvent);
            }
        }
    ];

    public constructor(container: Container) {
        this.inversify = container;
    }

    bindDependencies(
        socket: SocketIO.Server
    ) {
        if (this.containerInit) return;

        for (const c of this.containers) {
            if (c.bound) continue;

            c.init(socket);

            c.bound = true;
        }

        if (!this.containers.filter((c) => c.bound).length) {
            this.containerInit = true;

            console.log('All containers initiated');
        }
    }

    getDependency(identifier: any): any {
        return this.inversify.get(identifier);
    }
}
