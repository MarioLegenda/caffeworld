import 'reflect-metadata';
import {Express} from "express";
const express = require('express');
const app: Express = express();
const port = 3000;
import ContainerWrapper from "./src/container/ContainerWrapper";
import Redis from "./src/dataSource/redis";

require('dotenv').config();

Redis.client.on('ready', () => {
    ContainerWrapper.createContainer().bindDependencies();

    app.listen(port, () => console.log(`App listening on port ${port}!`))
});
