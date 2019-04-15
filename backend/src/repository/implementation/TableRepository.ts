import ITableRepository from "../contract/ITableRepository";
import ITable from "../contract/ITable";
import {inject, injectable} from "inversify";
import ISource from "../../source/contract/ISource";
import {Sources} from "../../source/Sources";
import {Symbols} from "../../container/Symbols";

@injectable()
export default class TableRepository implements ITableRepository {
    private source: ISource;

    constructor(
        @inject(Symbols.ISourceFactory) factory: (type: number) => ISource
    ) {
        this.source = factory(Sources.Redis);
    }

    getTable(identifier: string) {
    }

    hasTable(identifier: string): boolean {
        return false;
    }

    updateTable(identifier: string, data: ITable) {
    }

}
