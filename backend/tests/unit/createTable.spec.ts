import mocha from 'mocha';
import {validateTable} from "../../src/app/util/middleware";
import {middlewareFactory} from "../../src/app/util/middlewareFactory";
import CreateTable from "../../src/app/model/CreateTable";

const chai = require('chai'),
    expect = chai.expect,
    it = mocha.it;

it('should validate the create table and return the validated state object', function() {
    const impl = middlewareFactory([validateTable]);

    const data = {
        nickname: '',
        subject: null,
        subjectDescription: null,
        briefMessage: null,
    };

    const state = impl(data);

    expect(state).to.have.property('data');

    const createTableModel: CreateTable = state.data;

    expect(createTableModel).to.have.property('nickname');
    expect(createTableModel).to.have.property('subject');
    expect(createTableModel).to.have.property('subjectDescription');
    expect(createTableModel).to.have.property('briefMessage');

    expect(createTableModel.subject).to.be.equals(null);
    expect(createTableModel.subjectDescription).to.be.equals(null);
    expect(createTableModel.briefMessage).to.be.equals(null);
});

