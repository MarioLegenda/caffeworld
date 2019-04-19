import 'reflect-metadata';

require('dotenv').config();

import {Express} from "express";
const express = require('express');
const app: Express = express();
const path = require('path');
const http = require('http').Server(app);
import ContainerWrapper from "./src/container/ContainerWrapper";
import Redis from "./src/dataSource/redis";
import {onCreateTable, onSocketConnect} from "./src/app/events";

const io = require("socket.io")(http, { pingTimeout: 60000 });

app.use(express.static(path.join(__dirname, 'public')));

app.get('/table/create', function(req, res) {res.sendFile(path.join(`${__dirname}/public/index.html`));});
app.get('/', function(req, res) {res.sendFile(path.join(`${__dirname}/public/index.html`));});

Redis.client.on('ready', () => {
    ContainerWrapper.createContainer().bindDependencies();

    http.listen(3000, () => {
        io.on('connection', onSocketConnect);

        io.on('app.create-table', onCreateTable);

        console.log('Application started. Listening on port 3000');
    });
});
