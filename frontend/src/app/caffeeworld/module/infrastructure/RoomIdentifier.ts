import {Router} from "@angular/router";
import {Injectable} from "@angular/core";

@Injectable()
export class RoomIdentifier {
    private readonly identifier: string;
    private readonly url: string;

    constructor(router: Router) {
        this.identifier = router.url.split('/')[2];
        this.url = location.href;
    }

    get roomIdentifier(): string {
        return this.identifier;
    }

    get fullUrl(): string {
        return this.url;
    }
}
