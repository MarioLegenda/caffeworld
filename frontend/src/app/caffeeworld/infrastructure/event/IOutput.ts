export default interface IOutput {
    sendCreateTable(data: any): void;
    sendRoomEntered(data: any): void;
    sendDataExchange(data: any): void;
    sendIceExchangeEvent(data: any): void;
    sendChatMessage(data:any): void;
}
