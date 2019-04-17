import ITable from "./ITable";

export default interface ITableRepository {
    getTable(identifier: string, callback: Function);
    updateTable(identifier: string, data: ITable, callback: Function);
    hasTable(identifier: string, callback: Function): boolean;
}
