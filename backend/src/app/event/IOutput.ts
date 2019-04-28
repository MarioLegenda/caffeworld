export default interface IOutput {
    // TODO create a model for the data so it has a type
    createTable(data: any): void;
    sendUpdateRoom(roomIdentifier: string, data: any);
    sendRoomLeave(roomIdentifier: string, data: any);
    sendOffer(roomIdentifier: string, data: any);
    sendIceCandidate(roomIdentifier: string, data: any);
}
