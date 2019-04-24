import CacheableObservableFactory from "./CacheableObservableFactory";
import OnceObservableFactory from "./OnceObservableFactory";

export default class ObservableFactoryFactory {
    static createObservableFactory(name: string) {
        switch (name) {
            case 'cacheable': return new CacheableObservableFactory();
            case 'once': return new OnceObservableFactory();
            default: throw new Error(`ObservableFactoryFactory error. Factory with '${name}' does not eixst`);
        }
    }
}
