"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
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
    }
    get container() {
        return this.inversify;
    }
}
exports.default = ContainerFactory;
