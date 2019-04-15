import ISource from "../contract/ISource";

export default class InMemorySource implements ISource {
    getObject(identifier: string, callback: Function): object | null {
        return undefined;
    }
}
