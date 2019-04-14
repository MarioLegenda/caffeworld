import {RedisClient, RedisError} from "redis";
import mocha from 'mocha';

const redis = require("redis"),
    chai = require('chai'),
    client: RedisClient = redis.createClient(),
    it = mocha.it;

client.on("error", function (err: RedisError) {
    throw new Error(err.message);
});

it("should return the value 'value'", function(done) {
    client.set("key", "value");

    client.get('key', function(err, val) {
        chai.expect(val).to.be.equals(val);

        done();

        client.quit();
    });
});

client.on('reconnection', function(err) {
    throw new Error('Redis server should not be trying to reconnect')
});

client.on('end', function() {
    process.exit(0);
});
