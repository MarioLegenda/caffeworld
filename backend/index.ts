import 'reflect-metadata';
import extensions from './src/app/util/extensions';
import {app} from './app';
import SocketFrontController from "./src/app/SocketFrontController";
import ContainerWrapper from "./src/container/ContainerWrapper";
import {Container} from "inversify";
import {BindingTypeEnum} from "./src/container/BindingTypeEnum";
import Redis from "./src/dataSource/redis";
import Socket from "./src/app/web/Socket";
import {Symbols} from "./src/container/Symbols";
import IOutput from "./src/app/event/IOutput";

require('dotenv').config();

extensions();

const io = require("socket.io")(app.http, { pingTimeout: 60000, path: '/socket' });
const tableNamespace = io.of('/table');
const roomNamespace = io.of('/room');
const {promisify} = require('util');

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

            Socket.refresh(tableNamespace, socket);

            const cw = new ContainerWrapper(new Container());

            cw.bind(BindingTypeEnum.DEFAULT);
            cw.bind(BindingTypeEnum.TABLE);

            const fc = new SocketFrontController(cw);

            fc.initTable();

            socket.on('disconnect', () => {
                socket.disconnect();

                console.log('Table namespace has disconnected');
            });
        });

        roomNamespace.on('connection', (socket) => {
            console.log('Room namespace is connected');

            Socket.refresh(roomNamespace, socket);

            const cw = new ContainerWrapper(new Container());

            cw.bind(BindingTypeEnum.DEFAULT);
            cw.bind(BindingTypeEnum.ROOM);

            const fc = new SocketFrontController(cw);

            fc.initRoom();

            socket.on('ping', () => {
                socket.emit('pong');
            });

            // ugly but better to keep this here and not complicate
            socket.on('disconnect', async () => {
                const getAsync = promisify(Redis.client.get).bind(Redis.client);

                const socketId = socket.id;

                try {
                    const links = JSON.parse(await getAsync('app.internal.room_links'));

                    if (socketId in links) {
                        const roomIdentifier = links[socketId];

                        let tableData = JSON.parse(await getAsync(roomIdentifier));

                        const members = tableData.room.members;

                        members.list.splice(members.list.indexOf(socketId), 1);
                        members.count = members.list.count();

                        tableData.room.members = members;

                        Redis.client.set(roomIdentifier, JSON.stringify(tableData));

                        const output: IOutput = cw.getDependency(Symbols.Output);

                        output.sendRoomLeave(roomIdentifier, tableData);
                    }
                } catch (err) {
                    throw new Error(`Error occurred on socket disconnect with message: ${err.message}`);
                }

                socket.disconnect();

                console.log('Room namespace has disconnected');
            });
        });

        console.log('Server is ready. Listening on port 3000');
    });
