import {createClient} from "redis";
import {RedisClient} from "redis";

/**
 * No complications. Redis is a singleton
 */
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
