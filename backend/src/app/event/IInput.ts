export default interface IInput {
    onTableCreate(subscriberFactory?: Function | null, context?: object): void;
    onOfferCreated(subscriberFactory?: Function | null, context?: object): void;
    onRoomEntered(subscriberFactory?: Function | null, context?: object): void;
    onIceCandidate(subscriberFactory?: Function | null, context?: object): void;
}
