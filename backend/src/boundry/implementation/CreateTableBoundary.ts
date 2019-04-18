import IBoundary from "../contract/IBoundary";
import {inject, injectable} from "inversify";
import TableInterpreter from "../../interpreter/TableInterpreter";
import {Symbols} from "../../container/Symbols";
import ICreateTable from "../model/contract/ICreateTable";

@injectable()
export default class CreateTableBoundary implements IBoundary {
    private tableInterpreter: TableInterpreter;

    constructor(
        @inject(Symbols.TableInterpreter) tableInterpreter: TableInterpreter
    ) {
        this.tableInterpreter = tableInterpreter;
    }

    createTable(createTableModel: ICreateTable, callback: Function) {


        return this.tableInterpreter.createTable(createTableModel, callback);
    }
}
