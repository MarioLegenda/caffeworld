export default interface IInput {
    onTableCreated(subscriber, context?: object): void;
    onRoomUpdated(subscriber, context?: object): void;
    onRoomLeave(subscriber, context?: object): void;
    onDataExchange(subscriber, context?: object): void;
    onIceCandidateExchange(subscriber, context?: object): void;
    onChatMessage(subscriber, context?: object): void;
    onMaxSessions(subscriber, context?: object): void;
}
