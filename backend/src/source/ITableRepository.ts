import ITable from "./ITable";

export default interface ITableRepository {
    getTable(identifier: string);
    updateTable(identifier: string, data: ITable);
    hasTable(identifier: string): boolean;
}
