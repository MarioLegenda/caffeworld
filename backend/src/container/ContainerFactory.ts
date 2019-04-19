import {Container, interfaces} from "inversify";

export default class ContainerFactory {
    private inversify: Container = null;

    create(): void {
        if (this.inversify) {
            throw new Error(`Container has been already initialized. There can be only one container in the application`);
        }

        this.inversify = new Container();
    }

    bindDependencies() {
    }

    get container() {
        return this.inversify;
    }
}
