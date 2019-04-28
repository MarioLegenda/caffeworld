import {inject, injectable} from "inversify";
import {Symbols} from "../../container/Symbols";
import IData from "../util/IData";
import Output from "../event/Output";

@injectable()
export default class IceService {
    private output: Output;

    constructor(
        @inject(Symbols.Output) output: Output
    ) {
        this.output = output;
    }

    onOffer(data: IData) {
        this.output.sendOffer(data.data.roomIdentifier, data.data);
    }

    onIceCandidate(data: IData) {
        this.output.sendIceCandidate(data.data.roomIdentifier, data.data);
    }
}
