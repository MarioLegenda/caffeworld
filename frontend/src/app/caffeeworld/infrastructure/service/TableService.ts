import Output from '../event/Output';
import Input from '../event/Input';
import {Injectable} from "@angular/core";

@Injectable()
export class TableService {
    constructor(
        private input: Input,
        private output: Output,
    ) {}

    createTable(data: object) {
        this.output.sendCreateTable(data);
    }

    onTableCreated(subscriber, context?: object) {
        this.input.onTableCreated(subscriber, context);
    }
}
