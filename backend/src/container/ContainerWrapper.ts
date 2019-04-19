import {Container} from "inversify";

export default class ContainerWrapper {
    private static inversify: Container;

    private constructor(container: Container) {
        ContainerWrapper.inversify = container;
    }

    static createContainer() {
        if (ContainerWrapper.inversify) {
            throw new Error('Container already created');
        }

        return new ContainerWrapper(new Container());
    }

    bindDependencies() {

    }
}
