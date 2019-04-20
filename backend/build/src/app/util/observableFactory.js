"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const inversify_1 = require("inversify");
let ObservableFactory = class ObservableFactory {
    constructor() {
        this.observables = new Map();
    }
    createAndGetObservable(name) {
        if (!this.observables.has(name)) {
            this.observables.set(name, new rxjs_1.Subject());
        }
        return this.observables.get(name);
    }
    getObservable(name) {
        return this.observables.get(name);
    }
    unsubscribe() {
        this.observables.forEach((value, kex) => {
            value.unsubscribe();
        });
        this.observables.clear();
    }
};
ObservableFactory = __decorate([
    inversify_1.injectable()
], ObservableFactory);
exports.default = ObservableFactory;
