import 'reflect-metadata';

require('dotenv').config();

import {app} from './app';
import ContainerWrapper from "./src/container/ContainerWrapper";
import {Symbols} from "./src/container/Symbols";
import SocketCommunicator from "./src/app/SocketCommunicator";
import TableService from "./src/app/TableService";

app.expressApp.use(app.express.static(app.path.join(__dirname, 'public')));

app.expressApp.get('/table/create', function(req, res) {res.sendFile(app.path.join(`${__dirname}/public/index.html`));});
app.expressApp.get('/', function(req, res) {res.sendFile(app.path.join(`${__dirname}/public/index.html`));});

app.init()
    .on('app.event.redis.ready', () => {
        console.log('Redis is ready');
    })
    .on('app.event.redis.error', (err) => {
        console.error(`Redis event error occurred: ${err.message}`)
    })
    .on('app.event.server.ready', () => {
        ContainerWrapper.createContainer().bindDependencies();

        const socketCommunicator: SocketCommunicator = ContainerWrapper.container.getDependency(Symbols.SocketCommunicator);
        const tableService: TableService = ContainerWrapper.container.getDependency(Symbols.TableService);

        socketCommunicator.onConnect((socket) => {
            console.log('Socket is connected');

            tableService.onTableCreate(socket);
        });
        console.log('Server is ready. Listening on port 3000');
    });
