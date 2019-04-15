import IBoundary from "../IBoundary";
import {inject, injectable} from "inversify";
import IBoundaryResult from "../model/contract/IBoundaryResult";
import TableInterpreter from "../../interpreter/TableInterpreter";
import {Symbols} from "../../container/Symbols";

@injectable()
export default class CreateTableBoundary implements IBoundary {
    private tableInterpreter: TableInterpreter;

    constructor(
        @inject(Symbols.TableInterpreter) tableInterpreter: TableInterpreter
    ) {
        this.tableInterpreter = tableInterpreter;
    }

    getResult(): IBoundaryResult {
        return {success: true, data: null}
    }
}
