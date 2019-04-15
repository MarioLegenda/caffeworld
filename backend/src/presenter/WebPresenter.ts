import {inject, injectable} from "inversify";
import {Symbols} from "../container/Symbols";
import IBoundary from "../boundry/IBoundary";
import {BoundaryType} from "../boundry/BoundaryType";

@injectable()
export default class WebPresenter {
    private boundary: IBoundary;

    constructor(
        @inject(Symbols.BoundaryFactory) boundaryFactory: (type: number) => IBoundary
    ) {
        this.boundary = boundaryFactory(BoundaryType.CreateTableBoundary)
    }
}
