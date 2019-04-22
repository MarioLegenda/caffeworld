"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function middlewareFactory(middleware) {
    return function (data, context) {
        const state = {};
        state.data = data;
        for (let m of middleware) {
            m.call((context) ? context : null, [state]);
        }
        return state;
    };
}
exports.middlewareFactory = middlewareFactory;
