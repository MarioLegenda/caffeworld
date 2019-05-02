import { onIceCandidateExchange } from '../../../../../../backend/src/app/pureFunctions';
export default interface IInput {
    onTableCreated(subscriber, context?: object): void;
    onRoomUpdated(subscriber, context?: object): void;
    onRoomLeave(subscriber, context?: object): void;
    onDataExchange(subscriber, context?: object): void;
    onIceCandidateExchange(subscriber, context?: object): void;
}
