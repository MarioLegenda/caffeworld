export default class SingletonSocketInstance {
    public readonly socket: any;
    public readonly io;
    public readonly namespaceType;

    constructor(io, socket, namespaceType: string) {
        this.socket = socket;
        this.io = io;
        this.namespaceType = namespaceType;
    }
}
