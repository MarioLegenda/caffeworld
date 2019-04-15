"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const RedisSource_1 = __importDefault(require("../source/redis/RedisSource"));
const Symbols_1 = require("./Symbols");
const TableRepository_1 = __importDefault(require("../source/implementation/TableRepository"));
const TableInterpreter_1 = __importDefault(require("../interpreter/TableInterpreter"));
const CreateTableBoundary_1 = __importDefault(require("../boundry/implementation/CreateTableBoundary"));
class ContainerFactory {
    constructor() {
        this.inversify = null;
    }
    create() {
        if (this.inversify) {
            throw new Error(`Container has been already initialized. There can be only one container in the application`);
        }
        this.inversify = new inversify_1.Container();
    }
    bindDependencies() {
        this.inversify.bind(Symbols_1.Symbols.ISourceFactory).toFactory((context) => {
            return (type) => {
                switch (type) {
                    case 1: {
                        return context.container.get(Symbols_1.Symbols.RedisSource);
                    }
                    default: {
                        throw new Error(`Source for type ${type} not found`);
                    }
                }
            };
        });
        this.inversify.bind(Symbols_1.Symbols.WebPresenter).toFactory((context) => {
            return (type) => {
                switch (type) {
                    case 1: {
                        return context.container.get(Symbols_1.Symbols.WebPresenter);
                    }
                    default: {
                        throw new Error(`Presenter for type ${type} not found`);
                    }
                }
            };
        });
        this.inversify.bind(Symbols_1.Symbols.BoundaryFactory).toFactory((context) => {
            return (type) => {
                switch (type) {
                    case 1: {
                        return context.container.get(Symbols_1.Symbols.CreateTableBoundary);
                    }
                    default: {
                        throw new Error(`Boundary for type ${type} not found`);
                    }
                }
            };
        });
        this.inversify.bind(Symbols_1.Symbols.TableRepository).to(TableRepository_1.default);
        this.inversify.bind(Symbols_1.Symbols.RedisSource).to(RedisSource_1.default);
        this.inversify.bind(Symbols_1.Symbols.TableInterpreter).to(TableInterpreter_1.default);
        this.inversify.bind(Symbols_1.Symbols.CreateTableBoundary).to(CreateTableBoundary_1.default);
    }
    get container() {
        return this.inversify;
    }
}
exports.default = ContainerFactory;
