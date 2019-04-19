"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express = require('express');
const app = express();
const port = 3000;
const ContainerWrapper_1 = __importDefault(require("./src/container/ContainerWrapper"));
const redis_1 = __importDefault(require("./src/dataSource/redis"));
require('dotenv').config();
redis_1.default.client.on('ready', () => {
    ContainerWrapper_1.default.createContainer().bindDependencies();
    app.listen(port, () => console.log(`App listening on port ${port}!`));
});
