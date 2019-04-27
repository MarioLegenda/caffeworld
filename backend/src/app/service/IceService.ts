import {inject, injectable} from "inversify";
import {Symbols} from "../../container/Symbols";
import SingletonSocketInstance from "../web/SingletonSocketInstance";
import ISocketData from "../util/ISocketData";
import Socket from "../web/Socket";

@injectable()
export default class IceService {
    private readonly socketInstance: SingletonSocketInstance;

    private readonly iceAnswerEvent: string = 'app.client.ice.answer';
    private readonly iceCandidateClientEvent: string = 'app.client.ice.candidate';

    constructor(
        @inject(Symbols.SingletonSocketInstance) socket: SingletonSocketInstance
    ) {
        this.socketInstance = socket;
    }

    onOffer(socketData: ISocketData) {
        Socket.namespace.to(socketData.data.roomIdentifier).emit(this.iceAnswerEvent, socketData.data);
    }

    onIceCandidate(socketData: ISocketData) {
        Socket.namespace.to(socketData.data.roomIdentifier).emit(this.iceCandidateClientEvent, socketData.data);
    }
}
