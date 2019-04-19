export default function middleware(middleware: Function[]) {
    this.state = {};

    for (let m of middleware) {
        const boundMiddleware = m.bind(this);

        process.nextTick(boundMiddleware);
    }
}
