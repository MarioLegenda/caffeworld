import {Container} from "inversify";
import {Symbols} from "./Symbols";
import TableEvent from "../app/event/TableEvent";
import TableService from "../app/service/TableService";
import RoomEvent from "../app/event/RoomEvent";
import SingletonSocketInstance from "../app/web/SingletonSocketInstance";
import RoomService from "../app/service/RoomService";

export default class ContainerWrapper {
    private readonly inversify: Container;

    private readonly containers = {
        'default': {
            bound: false,
            init: (dependencies: Array<any>) => {
                let [socket] = dependencies;

                this.inversify.bind<SingletonSocketInstance>(Symbols.SingletonSocketInstance).toDynamicValue(() => new SingletonSocketInstance(socket));
            }
        },
        table: {
            bound: false,
            init: () => {

                this.inversify.bind<TableEvent>(Symbols.TableEvent).to(TableEvent);
                this.inversify.bind<TableService>(Symbols.TableService).to(TableService);
            }
        },
        room: {
            bound: false,
            init: () => {
                this.inversify.bind<RoomService>(Symbols.RoomService).to(RoomService);
                this.inversify.bind<RoomEvent>(Symbols.RoomEvent).to(RoomEvent);
            }
        }
    };

    public constructor(container: Container) {
        this.inversify = container;
    }

    bind(name: string, dependencies?: Array<any>): void {
        const c = this.containers[name];

        if (!c.bound) {
            c.init(dependencies);
            c.bound = true;

            return;
        }
    }

    getDependency(identifier: any): any {
        return this.inversify.get(identifier);
    }
}
