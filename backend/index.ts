import 'reflect-metadata';

require('dotenv').config();

import {app} from './app';

const io = require("socket.io")(app.http, { pingTimeout: 60000, path: '/socket' });

import SocketFrontController from "./src/app/SocketFrontController";
import ContainerWrapper from "./src/container/ContainerWrapper";
import {Container} from "inversify";

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
        io.on('connection', (socket) => {
            console.log('Socket is connected');

            const cw = new ContainerWrapper(new Container());

            cw.bindDependencies(socket);

            const fc = new SocketFrontController(cw);

            fc.initApp();

            socket.on('disconnect', () => {
                socket.disconnect();
                console.log('Server has disconnected');
            });
        });

        console.log('Server is ready. Listening on port 3000');
    });
