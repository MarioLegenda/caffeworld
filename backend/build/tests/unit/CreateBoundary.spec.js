"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const mocha_1 = __importDefault(require("mocha"));
const ContainerFactory_1 = __importDefault(require("../../src/container/ContainerFactory"));
const chai = require('chai'), it = mocha_1.default.it;
const factory = new ContainerFactory_1.default();
factory.create();
factory.bindDependencies();
it('should create a new table', function (done) {
});
