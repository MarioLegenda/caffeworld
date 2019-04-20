import { Component } from '@angular/core';
import 'rxjs/add/operator/filter';
import {Router, Event, NavigationEnd, NavigationStart} from "@angular/router";
import ObservableFactory from "./caffeeworld/infrastructure/ObservableFactory";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    private previousRoute: string;

    constructor(
        private router: Router,
        private observableFactory: ObservableFactory
    ) {
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                if (this.previousRoute === '/table/create') {
                    this.observableFactory.unsubscribe();
                }

                this.previousRoute = event.url;
            }
        });
    }
}
