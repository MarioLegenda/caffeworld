import ITableRepository from "../source/ITableRepository";
import {inject, injectable} from "inversify";
import {Symbols} from "../container/Symbols";

@injectable()
export default class TableInterpreter {
    private repository: ITableRepository;

    constructor(
        @inject(Symbols.TableRepository) repository: ITableRepository
    ) {
        this.repository = repository;
    }

    createTable() {

    }
}
