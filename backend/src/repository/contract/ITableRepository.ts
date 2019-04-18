import ITable from "./ITable";

export default interface ITableRepository {
    createTable(identifier: string, callback: Function);
    getTable(identifier: string, callback: Function);
    updateTable(identifier: string, data: ITable, callback: Function);
    hasTable(identifier: string, callback: Function): boolean;
}
