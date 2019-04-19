"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const ContainerWrapper_1 = __importDefault(require("./src/container/ContainerWrapper"));
const redis_1 = __importDefault(require("./src/dataSource/redis"));
const events_1 = require("./src/app/events");
const io = require("socket.io")(http, { pingTimeout: 60000 });
app.use(express.static(path.join(__dirname, 'public')));
app.get('/table/create', function (req, res) { res.sendFile(path.join(`${__dirname}/public/index.html`)); });
app.get('/', function (req, res) { res.sendFile(path.join(`${__dirname}/public/index.html`)); });
redis_1.default.client.on('ready', () => {
    ContainerWrapper_1.default.createContainer().bindDependencies();
    http.listen(3000, () => {
        io.on('connection', events_1.onSocketConnect);
        io.on('app.create-table', events_1.onCreateTable);
        console.log('Application started. Listening on port 3000');
    });
});
