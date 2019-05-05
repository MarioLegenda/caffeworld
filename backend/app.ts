import {Express} from "express";
import Redis from "./src/dataSource/redis";
const EventEmitter = require('events').EventEmitter;
const express = require('express');
const expressApp: Express = express();
const path = require('path');
const http = require('http').Server(expressApp);

/**
 * Made every async action an EventEmitter for better readability and ease of use
 */
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
                main.globalEvent.emit('app.event.server.ready');
            });
        });

        Redis.client.on('error', (err) => {
            // @ts-ignore
            main.globalEvent.emit('app.event.redis.error', err);
        });

        return this.globalEvent;
    }
};

/**
 * Just making sure that I don't override this by mistake. Also, no need to maximise the number
 * of listeners since I only need 3
 */
Object.defineProperty(main, 'globalEvent', {
    writable: false,
    value: new EventEmitter()
});

export const app = main;
