import 'reflect-metadata';

import mocha from 'mocha';
import ContainerFactory from '../../src/container/ContainerFactory';

const
    chai = require('chai'),
    it = mocha.it;

const factory = new ContainerFactory();

factory.create();
factory.bindDependencies();

it('should create a new boundary', function(done) {

});
