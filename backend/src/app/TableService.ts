import {injectable} from "inversify";

@injectable()
export default class TableService {
    onTableCreate(socket) {
        socket.on('app.table.create', (data) => {
            console.log(data);
        })
    }
}
