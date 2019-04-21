"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const redis_1 = __importDefault(require("../../dataSource/redis"));
const uuid = require('uuid/v4');
let TableService = class TableService {
    createTable(socketMiddlewareResult) {
        const { data, socket } = socketMiddlewareResult;
        const roomIdentifier = uuid();
        const url = `${process.env.SITE_URL}/table/${roomIdentifier}`;
        const redisData = {
            table: data,
            room: {
                url: url,
                path: `/table/${roomIdentifier}`
            },
        };
        redis_1.default.client.set(roomIdentifier, JSON.stringify(redisData));
        socket.join(roomIdentifier);
        socket.emit('app.event.table.created', redisData);
    }
};
TableService = __decorate([
    inversify_1.injectable()
], TableService);
exports.default = TableService;
