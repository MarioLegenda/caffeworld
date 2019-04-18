import ITableRepository from "../repository/contract/ITableRepository";
import {inject, injectable} from "inversify";
import {Symbols} from "../container/Symbols";
import ICreateTable from "../boundry/model/contract/ICreateTable";
import IBoundaryResult from "../boundry/model/contract/IBoundaryResult";

@injectable()
export default class TableInterpreter {
    private repository: ITableRepository;

    constructor(
        @inject(Symbols.TableRepository) repository: ITableRepository
    ) {
        this.repository = repository;
    }

    createTable(createTableModel: ICreateTable, callback: Function) {

    }
}
