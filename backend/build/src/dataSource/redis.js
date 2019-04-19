"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
class Redis {
    constructor() { }
    static get client() {
        if (!Redis.redisClient) {
            Redis.redisClient = redis_1.createClient();
        }
        return Redis.redisClient;
    }
}
exports.default = Redis;
