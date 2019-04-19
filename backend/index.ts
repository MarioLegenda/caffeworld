import 'reflect-metadata';

require('dotenv').config();

import {Express} from "express";

const http = require('http');
const express = require('express');
const app: Express = express();
const port = 3000;
import ContainerWrapper from "./src/container/ContainerWrapper";
import Redis from "./src/dataSource/redis";
import {onCreateTable, onSocketConnect} from "./src/app/events";

const io = require("socket.io")(http, { pingTimeout: 60000 });

Redis.client.on('ready', () => {
    ContainerWrapper.createContainer().bindDependencies();

    app.listen(port, () => {
        io.on('connection', onSocketConnect);

        io.on('app.create-table', onCreateTable);

        console.log('Application started. Listening on port 3000');
    });
});
