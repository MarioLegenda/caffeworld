"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("./src/dataSource/redis"));
const EventEmitter = require('events').EventEmitter;
const express = require('express');
const expressApp = express();
const path = require('path');
const http = require('http').Server(expressApp);
let main = {
    express: express,
    expressApp: expressApp,
    path: path,
    http: http,
    init: function () {
        redis_1.default.client.on('ready', () => {
            // @ts-ignore
            main.globalEvent.emit('app.event.redis.ready');
            main.http.listen(3000, () => {
                // @ts-ignore
                exports.app.globalEvent.emit('app.event.server.ready');
            });
        });
        redis_1.default.client.on('error', (err) => {
            // @ts-ignore
            main.globalEvent.emit('app.event.redis.error', err);
        });
        return this.globalEvent;
    }
};
Object.defineProperty(main, 'globalEvent', {
    writable: false,
    value: new EventEmitter()
});
exports.app = main;
