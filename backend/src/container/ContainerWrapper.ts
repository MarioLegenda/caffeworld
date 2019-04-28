import {Container} from "inversify";
import {Symbols} from "./Symbols";
import TableService from "../app/service/TableService";
import RoomService from "../app/service/RoomService";
import {BindingTypeEnum} from "./BindingTypeEnum";
import IceService from "../app/service/IceService";
import Input from '../app/event/Input';
import Output from '../app/event/Output';

export default class ContainerWrapper {
    private readonly inversify: Container;

    private readonly containers = {};

    public constructor(container: Container) {
        this.inversify = container;

        this.containers[BindingTypeEnum.DEFAULT] = {
            bound: false,
            init: () => {
                this.inversify.bind<Input>(Symbols.Input).to(Input);
                this.inversify.bind<Output>(Symbols.Output).to(Output);
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
                this.inversify.bind<IceService>(Symbols.IceService).to(IceService);
            }
        };
    }

    bind(name: string): void {
        const c = this.containers[name];

        if (!c.bound) {
            c.init();
            c.bound = true;

            return;
        }
    }

    getDependency(identifier: any): any {
        return this.inversify.get(identifier);
    }
}
