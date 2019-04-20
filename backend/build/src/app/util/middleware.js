"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function middleware(middleware, context) {
    this.state = {};
    for (let m of middleware) {
        m.call((context) ? context : this, [this.state]);
    }
    this.state = {};
}
exports.default = middleware;
