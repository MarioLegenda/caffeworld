export function middlewareFactory(middleware: Function[]) {
    return function(data: any, context?: object) {
        const state = {} as any;

        state.data = data;

        for (let m of middleware) {
            m.call((context) ? context : null, [state]);
        }

        return state;
    };
}
