import {inject, injectable} from "inversify";
import {Symbols} from "../container/Symbols";
import {BoundaryType} from "../boundry/BoundaryType";
import CreateTable from "../boundry/model/implementation/CreateTable";
import ICreateTable from "../boundry/model/contract/ICreateTable";
import IBoundary from "../boundry/contract/IBoundary";
import ICreateTableBoundary from "../boundry/contract/ICreateTableBoundary";

@injectable()
export default class WebPresenter {
    private readonly boundaryFactory: Function;

    constructor(
        @inject(Symbols.BoundaryFactory) boundaryFactory: (type: number) => IBoundary
    ) {
        this.boundaryFactory = boundaryFactory;
    }

    createTable(data: object, callback: Function) {
        const createTableModel: ICreateTable = data as CreateTable;

        const boundary: ICreateTableBoundary = this.boundaryFactory(BoundaryType.CreateTableBoundary);

        return boundary.createTable(createTableModel, callback);
    }
}
