export default interface IInput {
    onTableCreated(subscriber, context?: object): void;
    onRoomUpdated(subscriber, context?: object): void;
    onRoomLeave(subscriber, context?: object): void;
    onIceOffer(subscriber, context?: object): void;
    onAddIceCandidate(subscriber, context?: object): void;
}
