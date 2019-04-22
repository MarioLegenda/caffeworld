"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("../dataSource/redis"));
const uuid = require('uuid/v4');
function onCreateTable(data) {
    const identifier = uuid();
    redis_1.default.client.set(identifier, JSON.stringify(data));
}
exports.onCreateTable = onCreateTable;
function onSocketConnect(socket) {
    console.log('Socket connection established');
    socket.on('app.table.create', onCreateTable);
    socket.on('disconnect', onSocketDisconnect);
}
exports.onSocketConnect = onSocketConnect;
function onSocketDisconnect() {
    console.log('Socket disconnected');
}
exports.onSocketDisconnect = onSocketDisconnect;
