import {Container, interfaces} from "inversify";
import RedisSource from "../source/redis/RedisSource";
import {Symbols} from "./Symbols";
import ISource from "../source/contract/ISource";
import ITableRepository from "../repository/contract/ITableRepository";
import TableRepository from "../repository/implementation/TableRepository";
import TableInterpreter from "../interpreter/TableInterpreter";
import CreateTableBoundary from "../boundry/implementation/CreateTableBoundary";
import IBoundary from "../boundry/contract/IBoundary";
import WebPresenter from "../presenter/WebPresenter";

export default class ContainerFactory {
    private inversify: Container = null;

    create(): void {
        if (this.inversify) {
            throw new Error(`Container has been already initialized. There can be only one container in the application`);
        }

        this.inversify = new Container();
    }

    bindDependencies() {
        this.inversify.bind<interfaces.Factory<ISource>>(Symbols.ISourceFactory).toFactory<ISource>((context: interfaces.Context) => {
            return (type: number) => {
                switch (type) {
                    case 1: {
                        return context.container.get<RedisSource>(Symbols.RedisSource);
                    }

                    default: {
                        throw new Error(`Source for type ${type} not found`);
                    }
                }
            };
        });

        this.inversify.bind<interfaces.Factory<WebPresenter>>(Symbols.PresenterFactory).toFactory<WebPresenter>((context: interfaces.Context) => {
            return (type: number) => {
                switch (type) {
                    case 1: {
                        return context.container.get<WebPresenter>(Symbols.WebPresenter);
                    }

                    default: {
                        throw new Error(`Presenter for type ${type} not found`);
                    }
                }
            };
        });

        this.inversify.bind<interfaces.Factory<IBoundary>>(Symbols.BoundaryFactory).toFactory<IBoundary>((context: interfaces.Context) => {
            return (type: number) => {
                switch (type) {
                    case 1: {
                        return context.container.get<CreateTableBoundary>(Symbols.CreateTableBoundary);
                    }

                    default: {
                        throw new Error(`Boundary for type ${type} not found`);
                    }
                }
            };
        });

        this.inversify.bind<WebPresenter>(Symbols.WebPresenter).to(WebPresenter);
        this.inversify.bind<ITableRepository>(Symbols.TableRepository).to(TableRepository);
        this.inversify.bind<ISource>(Symbols.RedisSource).to(RedisSource);
        this.inversify.bind<TableInterpreter>(Symbols.TableInterpreter).to(TableInterpreter);
        this.inversify.bind<IBoundary>(Symbols.CreateTableBoundary).to(CreateTableBoundary);

    }

    get container() {
        return this.inversify;
    }
}
