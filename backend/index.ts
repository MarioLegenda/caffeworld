import 'reflect-metadata';
import extensions from './src/app/util/extensions';
import {app} from './app';
import Redis from "./src/dataSource/redis";
import {TransportTypeEnum} from "./src/app/web/TrasportTypeEnum";
import { createTable, onRoomEntered, onDataExchange, onDisconnect, onIceCandidateExchange } from './src/app/pureFunctions';

require('dotenv').config();

extensions();

const io = require("socket.io")(app.http, { pingTimeout: 60000, path: '/socket' });
const tableNamespace = io.of('/table');
const roomNamespace = io.of('/room');

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

            socket.on('app.server.table.create', (data) => {
                createTable(socket, data);
            });

            socket.on('disconnect', () => {
                console.log('Table namespace has disconnected');
            });
        });

        roomNamespace.on('connection', (socket) => {
            console.log('Room namespace is connected');

            socket.on('app.server.room.entered', (data) => {
                onRoomEntered(socket, roomNamespace, data);
            });

            socket.on('app.server.room.data_exchange', (data) => {
                onDataExchange(socket, data);
            });

            socket.on('app.server.room.ice_candidate_exchange', (data) => {
                onIceCandidateExchange(socket, data);
            });

            socket.on('peng', () => {
                socket.emit('pung');
            });

            // ugly but better to keep this here and not complicate
            socket.on('disconnect', async () => {
                await onDisconnect(socket);
            });
        });

        console.log('Server is ready. Listening on port 3000');
    });
