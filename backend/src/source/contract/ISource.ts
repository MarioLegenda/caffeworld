export default interface ISource {
    getObject(identifier: string, callback: Function): object | null;
}
