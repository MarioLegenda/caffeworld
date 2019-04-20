"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require('dotenv').config();
const app_1 = require("./app");
const ContainerWrapper_1 = __importDefault(require("./src/container/ContainerWrapper"));
const Symbols_1 = require("./src/container/Symbols");
app_1.app.expressApp.use(app_1.app.express.static(app_1.app.path.join(__dirname, 'public')));
app_1.app.expressApp.get('/table/create', function (req, res) { res.sendFile(app_1.app.path.join(`${__dirname}/public/index.html`)); });
app_1.app.expressApp.get('/', function (req, res) { res.sendFile(app_1.app.path.join(`${__dirname}/public/index.html`)); });
app_1.app.init()
    .on('app.event.redis.ready', () => {
    console.log('Redis is ready');
})
    .on('app.event.redis.error', (err) => {
    console.error(`Redis event error occurred: ${err.message}`);
})
    .on('app.event.server.ready', () => {
    ContainerWrapper_1.default.createContainer().bindDependencies();
    const socketCommunicator = ContainerWrapper_1.default.container.getDependency(Symbols_1.Symbols.SocketCommunicator);
    const tableService = ContainerWrapper_1.default.container.getDependency(Symbols_1.Symbols.TableService);
    socketCommunicator.onConnect((socket) => {
        console.log('Socket is connected');
        tableService.onTableCreate(socket);
    });
    console.log('Server is ready. Listening on port 3000');
});
