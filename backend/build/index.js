"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require('dotenv').config();
const http = require('http');
const express = require('express');
const app = express();
const port = 3000;
const ContainerWrapper_1 = __importDefault(require("./src/container/ContainerWrapper"));
const redis_1 = __importDefault(require("./src/dataSource/redis"));
const io = require("socket.io")(http, { pingTimeout: 60000 });
redis_1.default.client.on('ready', () => {
    ContainerWrapper_1.default.createContainer().bindDependencies();
    app.listen(port, () => {
        io.on('connection', function (socket) {
            console.log('a user connected');
            socket.on('disconnect', function () {
                console.log('user disconnected');
            });
        });
        console.log('Application started. Listening on port 3000');
    });
});
