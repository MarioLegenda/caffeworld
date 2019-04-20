"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = __importDefault(require("mocha"));
const middleware_1 = require("../../src/app/util/middleware");
const middlewareFactory_1 = require("../../src/app/util/middlewareFactory");
const chai = require('chai'), expect = chai.expect, it = mocha_1.default.it;
it('should validate the create table and return the validated state object', function () {
    const impl = middlewareFactory_1.middlewareFactory([middleware_1.validateTable]);
    const data = {
        nickname: '',
        subject: '',
        subjectDescription: '',
        briefMessage: '',
    };
    const state = impl(data);
    expect(state).to.have.property('data');
    const createTableModel = state.data;
    expect(createTableModel).to.have.property('nickname');
    expect(createTableModel).to.have.property('subject');
    expect(createTableModel).to.have.property('subjectDescription');
    expect(createTableModel).to.have.property('briefMessage');
});
