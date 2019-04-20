import {injectable} from "inversify";

@injectable()
export default class TableService {
    createTable(data) {
        console.log(data);
    }
}
