import 'reflect-metadata';

require('dotenv').config();

import {app} from './app';

const io = require("socket.io")(app.http, { pingTimeout: 60000, path: '/socket' });
const tableNamespace = io.of('/table');
const roomNamespace = io.of('/room');

import SocketFrontController from "./src/app/SocketFrontController";
import ContainerWrapper from "./src/container/ContainerWrapper";
import {Container} from "inversify";
import {BindingTypeEnum} from "./src/container/BindingTypeEnum";

app.expressApp.use(app.express.static(app.path.join(__dirname, 'public')));

app.expressApp.get('**', function(req, res) {res.sendFile(app.path.join(`${__dirname}/public/index.html`));});

app.init()
    .on('app.event.redis.ready', () => {
        console.log('Redis is ready');
    })
    .on('app.event.redis.error', (err) => {
        console.error(`Redis event error occurred: ${err.message}`)
    })
    .on('app.event.server.ready', () => {
        tableNamespace.on('connection', (socket) => {
            console.log('Table namespace is connected');

            const cw = new ContainerWrapper(new Container());

            cw.bind(BindingTypeEnum.DEFAULT, [socket, tableNamespace]);
            cw.bind(BindingTypeEnum.TABLE);

            const fc = new SocketFrontController(cw);

            fc.initTable();

            socket.on('disconnect', () => {
                socket.disconnect();
                console.log('Server has disconnected');
            });
        });

        roomNamespace.on('connection', (socket) => {
            console.log('Room namespace is connected');

            const cw = new ContainerWrapper(new Container());

            cw.bind(BindingTypeEnum.DEFAULT, [socket, roomNamespace]);
            cw.bind(BindingTypeEnum.ROOM);

            const fc = new SocketFrontController(cw);

            fc.initRoom();

            socket.on('ping', () => {
                socket.emit('pong');
            });

            socket.on('disconnect', () => {
                socket.disconnect();
                console.log('Server has disconnected');
            });
        });

        console.log('Server is ready. Listening on port 3000');
    });
