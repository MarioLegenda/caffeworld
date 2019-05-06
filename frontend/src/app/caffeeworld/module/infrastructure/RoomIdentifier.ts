import {Router} from "@angular/router";
import {Injectable} from "@angular/core";

@Injectable()
export class RoomIdentifier {
    private readonly identifier: string;

    constructor(router: Router) {
        this.identifier = router.url.split('/')[2];
    }

    get roomIdentifier(): string {
        return this.identifier;
    }
}
