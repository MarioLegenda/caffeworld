export const Symbols = {
    RedisSource: Symbol.for('RedisSource'),
    TableRepository: Symbol.for('TableRepository'),
    ISourceFactory: Symbol.for('Factory<ISource>'),
    BoundaryFactory: Symbol.for('Factory<IBoundary>'),
    TableInterpreter: Symbol.for('TableInterpreter'),
    CreateTableBoundary: Symbol.for('CreateTableBoundary'),
    PresenterFactory: Symbol.for('Factory<Presenter>'),
    WebPresenter: Symbol.for('WebPresenter'),
};
