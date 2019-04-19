"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function middleware(middleware) {
    this.state = {};
    for (let m of middleware) {
        const boundMiddleware = m.bind(this);
        process.nextTick(boundMiddleware);
    }
}
exports.default = middleware;
