import ITableDate from "./../contract/ITableDate";
import ICreateTable from "./../contract/ICreateTable";

export default class CreateTable implements ICreateTable {
    nickname: string;
    subject?: string;
    subjectDescription?: string;
    datetime?: ITableDate;
    briefMessage?: string;
    createdAt?: string;
}
