import 'reflect-metadata';

require('dotenv').config();

import {Express} from "express";

const http = require('http');
const express = require('express');
const app: Express = express();
const port = 3000;
import ContainerWrapper from "./src/container/ContainerWrapper";
import Redis from "./src/dataSource/redis";
const io = require("socket.io")(http, { pingTimeout: 60000 });

Redis.client.on('ready', () => {
    ContainerWrapper.createContainer().bindDependencies();

    app.listen(port, () => {
        io.on('connection', function (socket: any) {
            console.log('a user connected');

            socket.on('disconnect', function () {
                console.log('user disconnected');
            });
        });

        console.log('Application started. Listening on port 3000');
    });
});
