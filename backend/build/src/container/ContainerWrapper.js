"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
class ContainerWrapper {
    constructor(container) {
        ContainerWrapper.inversify = container;
    }
    static createContainer() {
        if (ContainerWrapper.inversify) {
            throw new Error('Container already created');
        }
        return new ContainerWrapper(new inversify_1.Container());
    }
    bindDependencies() {
    }
}
exports.default = ContainerWrapper;
