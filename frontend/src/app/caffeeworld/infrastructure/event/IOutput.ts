export default interface IOutput {
    sendCreateTable(data: any): void;
    sendRoomEntered(data: any): void;
    sendDataExchange(data: any): void;
}
