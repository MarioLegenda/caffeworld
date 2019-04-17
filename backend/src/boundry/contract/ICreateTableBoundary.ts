import IBoundaryResult from "../model/contract/IBoundaryResult";
import ICreateTable from "../model/contract/ICreateTable";

export default interface ICreateTableBoundary {
    createTable(createTableModel: ICreateTable): IBoundaryResult;
}
