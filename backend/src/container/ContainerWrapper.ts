import {Container} from "inversify";
import {Symbols} from "./Symbols";
import TableEvent from "../app/event/TableEvent";
import TableService from "../app/service/TableService";
import RoomEvent from "../app/event/RoomEvent";
import SingletonSocketInstance from "../app/web/SingletonSocketInstance";
import RoomService from "../app/service/RoomService";
import {BindingTypeEnum} from "./BindingTypeEnum";

export default class ContainerWrapper {
    private readonly inversify: Container;

    private readonly containers = {};

    public constructor(container: Container) {
        this.inversify = container;

        this.containers[BindingTypeEnum.DEFAULT] = {
            bound: false,
            init: (dependencies: Array<any>) => {
                let [socket, io] = dependencies;

                this.inversify.bind<SingletonSocketInstance>(Symbols.SingletonSocketInstance).toDynamicValue(() => new SingletonSocketInstance(io, socket));
            }
        };

        this.containers[BindingTypeEnum.TABLE] = {
            bound: false,
            init: () => {

                this.inversify.bind<TableEvent>(Symbols.TableEvent).to(TableEvent);
                this.inversify.bind<TableService>(Symbols.TableService).to(TableService);
            }
        };

        this.containers[BindingTypeEnum.ROOM] = {
            bound: false,
            init: () => {
                this.inversify.bind<RoomService>(Symbols.RoomService).to(RoomService);
                this.inversify.bind<RoomEvent>(Symbols.RoomEvent).to(RoomEvent);
            }
        };
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
