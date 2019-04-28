import {inject, injectable} from "inversify";
import {Symbols} from "../../container/Symbols";
import ISocketData from "../util/ISocketData";
import Output from "../event/Output";

@injectable()
export default class IceService {
    private output: Output;

    constructor(
        @inject(Symbols.Output) output: Output
    ) {
        this.output = output;
    }

    onOffer(socketData: ISocketData) {
        this.output.sendOffer(socketData.data.roomIdentifier, socketData.data);
    }

    onIceCandidate(socketData: ISocketData) {
        this.output.sendIceCandidate(socketData.data.roomIdentifier, socketData.data);
    }
}
