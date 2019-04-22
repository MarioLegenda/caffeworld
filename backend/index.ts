import 'reflect-metadata';

require('dotenv').config();

import {app} from './app';

const io = require("socket.io")(app.http, { pingTimeout: 10, path: '/socket' });
import ContainerWrapper from "./src/container/ContainerWrapper";
import {Symbols} from "./src/container/Symbols";
import TableEvent from "./src/app/event/TableEvent";
import TableService from "./src/app/service/TableService";
import {middlewareFactory} from "./src/app/util/middlewareFactory";
import {validateTable} from "./src/app/util/middleware";
import RoomEvent from "./src/app/event/RoomEvent";
import RoomService from "./src/app/service/RoomService";

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
        ContainerWrapper.createContainer().bindDependencies();

        const tableEvent: TableEvent = ContainerWrapper.container.getDependency(Symbols.TableEvent);
        const roomEvent: RoomEvent = ContainerWrapper.container.getDependency(Symbols.RoomEvent);
        const tableService: TableService = ContainerWrapper.container.getDependency(Symbols.TableService);
        const roomService: RoomService = ContainerWrapper.container.getDependency(Symbols.RoomService);

        io.on('connection', (socket) => {
            console.log('Socket is connected');

            tableEvent
                .onTableCreate(socket, middlewareFactory([validateTable]))
                .subscribe(tableService.createTable);

            roomEvent.onRoomEntered(socket).subscribe(roomService.roomEntered);

            socket.on('disconnect', () => {
                tableEvent.flushEvents();
                roomEvent.flushEvents();
            });
        });

        console.log('Server is ready. Listening on port 3000');
    });
