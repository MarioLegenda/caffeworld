import 'reflect-metadata';

import mocha from 'mocha';
import ContainerFactory from '../../src/container/ContainerFactory';
import {Symbols} from "../../src/container/Symbols";
import WebPresenter from "../../src/presenter/WebPresenter";
import IBoundaryResult from "../../src/boundry/model/contract/IBoundaryResult";
import {PresenterType} from "../../src/presenter/PresenterType";

const
    chai = require('chai'),
    it = mocha.it,
    expect = chai.expect;

const factory = new ContainerFactory();

factory.create();
factory.bindDependencies();

it('should create a new table', function() {
    const webPresenterFactory: Function = factory.container.get(Symbols.PresenterFactory);
    const webPresenter: WebPresenter = webPresenterFactory(PresenterType.WebPresenter);

    const result: IBoundaryResult = webPresenter.createTable({});

    expect(result).to.be.a('object');
    expect(result.success).to.be.equals(true);
    expect(result.data).to.be.equals(null);
});
