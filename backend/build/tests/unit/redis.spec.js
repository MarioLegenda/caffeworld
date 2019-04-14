"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = __importDefault(require("mocha"));
const redis = require("redis"), chai = require('chai'), client = redis.createClient(), it = mocha_1.default.it;
client.on("error", function (err) {
    throw new Error(err.message);
});
it("should return the value 'value'", function (done) {
    client.set("key", "value");
    client.get('key', function (err, val) {
        chai.expect(val).to.be.equals(val);
        done();
        client.quit();
    });
});
client.on('reconnection', function (err) {
    throw new Error('Redis server should not be trying to reconnect');
});
client.on('end', function () {
    process.exit(0);
});
