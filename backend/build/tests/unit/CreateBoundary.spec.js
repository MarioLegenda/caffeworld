"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const mocha_1 = __importDefault(require("mocha"));
const ContainerFactory_1 = __importDefault(require("../../src/container/ContainerFactory"));
const Symbols_1 = require("../../src/container/Symbols");
const PresenterType_1 = require("../../src/presenter/PresenterType");
const chai = require('chai'), it = mocha_1.default.it, expect = chai.expect;
const factory = new ContainerFactory_1.default();
factory.create();
factory.bindDependencies();
it('should create a new table', function () {
    const webPresenterFactory = factory.container.get(Symbols_1.Symbols.PresenterFactory);
    const webPresenter = webPresenterFactory(PresenterType_1.PresenterType.WebPresenter);
    const result = webPresenter.createTable({});
    expect(result).to.be.a('object');
    expect(result.success).to.be.equals(true);
    expect(result.data).to.be.equals(null);
});
