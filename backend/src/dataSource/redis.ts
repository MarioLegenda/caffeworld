import {createClient} from "redis";
import {RedisClient} from "redis";

export default class Redis {
    private static redisClient: RedisClient;

    private constructor() {}

    static get client() {
        if (!Redis.redisClient) {
            Redis.redisClient = createClient();
        }

        return Redis.redisClient;
    }
}
