import {RedisClient} from "redis";
import ContainerWrapper from "./src/container/ContainerWrapper";
import {Express} from "express";
const express = require('express');
const app = express();
const port = 3000;

const redisClient: RedisClient = require('redis');

export default class FrontController {
    constructor(
        public expressApp: Express
    ) {}

    init() {
    }
}




