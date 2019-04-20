"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const Symbols_1 = require("../../container/Symbols");
const ObservableFactory_1 = __importDefault(require("../util/ObservableFactory"));
let TableEvent = class TableEvent {
    constructor(observableFactory) {
        this.createTableEvent = 'app.event.table.create';
        this.observableFactory = observableFactory;
    }
    onTableCreate(socket, middlewareImpl) {
        const subject = this.observableFactory.createAndGetObservable(this.createTableEvent);
        socket.on(this.createTableEvent, (data) => {
            const middlewareData = middlewareImpl(data);
            subject.next(middlewareData.data);
        });
        return this.observableFactory.getObservable(this.createTableEvent);
    }
    flushEvents() {
        this.observableFactory.unsubscribe();
    }
};
TableEvent = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(Symbols_1.Symbols.ObservableFactory)),
    __metadata("design:paramtypes", [ObservableFactory_1.default])
], TableEvent);
exports.default = TableEvent;
