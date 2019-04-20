"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const SocketCommunicator_1 = __importDefault(require("../app/SocketCommunicator"));
const Symbols_1 = require("./Symbols");
const TableService_1 = __importDefault(require("../app/TableService"));
class ContainerWrapper {
    constructor(container) {
        ContainerWrapper.inversify = container;
    }
    static createContainer() {
        if (ContainerWrapper.inversify) {
            throw new Error('Container already created');
        }
        ContainerWrapper.container = new ContainerWrapper(new inversify_1.Container());
        return ContainerWrapper.container;
    }
    bindDependencies() {
        ContainerWrapper.inversify.bind(Symbols_1.Symbols.SocketCommunicator).to(SocketCommunicator_1.default);
        ContainerWrapper.inversify.bind(Symbols_1.Symbols.TableService).to(TableService_1.default);
    }
    getDependency(identifier) {
        return ContainerWrapper.inversify.get(identifier);
    }
}
exports.default = ContainerWrapper;
