export default function middleware(middleware: Function[], context?: object) {
    this.state = {};

    for (let m of middleware) {
        m.call((context) ? context : this, [this.state]);
    }

    this.state = {};
}
