"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Symbols = {
    RedisSource: Symbol.for('RedisSource'),
    TableRepository: Symbol.for('TableRepository'),
    ISourceFactory: Symbol.for('Factory<ISource>'),
    BoundaryFactory: Symbol.for('Factory<IBoundary>'),
    TableInterpreter: Symbol.for('TableInterpreter'),
    CreateTableBoundary: Symbol.for('CreateTableBoundary'),
    WebPresenter: Symbol.for('WebPresenter'),
};
