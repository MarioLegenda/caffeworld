import ITableDate from "./ITableDate";

export default interface ICreateTable {
    nickname: string;
    subject?: string;
    subjectDescription?: string;
    datetime?: ITableDate;
    briefMessage?: string;
    createdAt?: string;
}
