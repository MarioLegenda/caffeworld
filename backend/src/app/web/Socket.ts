export default class Socket {
    public static socket;
    public static namespace;

    static refresh(namespace, socket) {
        Socket.namespace = namespace;
        Socket.socket = socket;
    }
}
