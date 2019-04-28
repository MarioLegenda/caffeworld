import Output from '../event/Output';
import {Injectable} from "@angular/core";
import IInput from "../event/IInput";
import Input from "../event/Input";
import IOutput from "../event/IOutput";

@Injectable()
export class TableService {
    private readonly input: IInput;
    private readonly output: IOutput;

    constructor(
        input: Input,
        output: Output,
    ) {
        this.input = input as IInput;
        this.output = output as IOutput;
    }

    createTable(data: object): void {
        this.output.sendCreateTable(data);
    }

    onTableCreated(subscriber, context?: object): void {
        this.input.onTableCreated(subscriber, context);
    }
}
