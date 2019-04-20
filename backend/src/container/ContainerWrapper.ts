import {Container} from "inversify";
import SocketCommunicator from "../app/SocketCommunicator";
import {Symbols} from "./Symbols";
import TableService from "../app/TableService";

export default class ContainerWrapper {
    private static inversify: Container;

    static container: ContainerWrapper;

    private constructor(container: Container) {
        ContainerWrapper.inversify = container;
    }

    static createContainer() {
        if (ContainerWrapper.inversify) {
            throw new Error('Container already created');
        }

        ContainerWrapper.container = new ContainerWrapper(new Container());

        return ContainerWrapper.container;
    }

    bindDependencies() {
        ContainerWrapper.inversify.bind<SocketCommunicator>(Symbols.SocketCommunicator).to(SocketCommunicator);
        ContainerWrapper.inversify.bind<TableService>(Symbols.TableService).to(TableService);
    }

    getDependency(identifier: any): any {
        return ContainerWrapper.inversify.get(identifier);
    }
}
