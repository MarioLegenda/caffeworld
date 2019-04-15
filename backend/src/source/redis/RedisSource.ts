import ISource from "../contract/ISource";
import {injectable} from "inversify";
var redis = require("redis"),
    client = redis.createClient();

@injectable()
export default class RedisSource implements ISource {
    getObject(identifier: string, callback: Function): object | null {
        return undefined;
    }
}
