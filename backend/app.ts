import {RedisClient} from "redis";

const redisClient: RedisClient = require('redis');

export default class App {
    init() {
        redisClient.on('ready', () => {

        });
    }
}
