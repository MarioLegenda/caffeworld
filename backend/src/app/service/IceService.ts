import {inject, injectable} from "inversify";
import {Symbols} from "../../container/Symbols";
import IData from "../util/IData";
import IOutput from "../event/IOutput";

@injectable()
export default class IceService {
    private output: IOutput;

    constructor(
        @inject(Symbols.Output) output: IOutput
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
