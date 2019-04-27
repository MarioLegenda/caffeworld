import {Container} from "inversify";
import {Symbols} from "./Symbols";
import TableService from "../app/service/TableService";
import RoomEvent from "../app/event/RoomEvent";
import SingletonSocketInstance from "../app/web/SingletonSocketInstance";
import RoomService from "../app/service/RoomService";
import {BindingTypeEnum} from "./BindingTypeEnum";
import IceService from "../app/service/IceService";
import IceEvent from "../app/event/IceEvent";
import Input from '../app/event/Input';
import Output from '../app/event/Output';

export default class ContainerWrapper {
    private readonly inversify: Container;

    private readonly containers = {};

    public constructor(container: Container) {
        this.inversify = container;

        this.containers[BindingTypeEnum.DEFAULT] = {
            bound: false,
            init: (dependencies: Array<any>) => {
                let [io, socket, namespaceType] = dependencies;

                this.inversify.bind<Input>(Symbols.Input).to(Input);
                this.inversify.bind<Output>(Symbols.Output).to(Output);
                this.inversify.bind<SingletonSocketInstance>(Symbols.SingletonSocketInstance).toDynamicValue(() => new SingletonSocketInstance(io, socket, namespaceType));
            }
        };

        this.containers[BindingTypeEnum.TABLE] = {
            bound: false,
            init: () => {

                this.inversify.bind<TableService>(Symbols.TableService).to(TableService);
            }
        };

        this.containers[BindingTypeEnum.ROOM] = {
            bound: false,
            init: () => {
                this.inversify.bind<RoomService>(Symbols.RoomService).to(RoomService);
                this.inversify.bind<RoomEvent>(Symbols.RoomEvent).to(RoomEvent);
                this.inversify.bind<IceService>(Symbols.IceService).to(IceService);
                this.inversify.bind<IceEvent>(Symbols.IceEvent).to(IceEvent);
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
