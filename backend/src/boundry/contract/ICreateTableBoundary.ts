import ICreateTable from "../model/contract/ICreateTable";

export default interface ICreateTableBoundary {
    createTable(createTableModel: ICreateTable, callback: Function);
}
