import {Express} from "express";
import Redis from "./src/dataSource/redis";
const EventEmitter = require('events').EventEmitter;
const express = require('express');
const expressApp: Express = express();
const path = require('path');
const http = require('http').Server(expressApp);

let main = {
    express: express,
    expressApp: expressApp,
    path: path,
    http: http,
    init: function() {
        Redis.client.on('ready', () => {
            // @ts-ignore
            main.globalEvent.emit('app.event.redis.ready');

            main.http.listen(3000, () => {
                // @ts-ignore
                app.globalEvent.emit('app.event.server.ready');
            });
        });

        Redis.client.on('error', (err) => {
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

export const app = main;
