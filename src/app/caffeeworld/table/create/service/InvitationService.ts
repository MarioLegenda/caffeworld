import {Injectable} from '@angular/core';

@Injectable()
export default class InvitationService {
    private invites = [];
    private currentAdded = 0;
    private addedTracker = [];

    private initCurrentAdded = this.currentAdded;

    constructor(private maxInvites: number) {}

    init(currentAdded: number) {
        this.currentAdded = currentAdded;
        this.addedTracker.push(currentAdded);
        this.initCurrentAdded = currentAdded;
    }

    add(identifier: string) {
        this.invites.push(identifier);
    }

    remove(index: number) {
        this.addedTracker.splice(this.addedTracker.indexOf(index), 1);
        this.currentAdded--;
    }

    has(identifier: string) {
        return this.invites.includes(identifier);
    }

    update() {
        if (this.valid) {
            this.currentAdded++;
            this.addedTracker.push(this.currentAdded);
        }
    }

    clear() {
        this.invites = [];
        this.currentAdded = this.initCurrentAdded;
        this.addedTracker = [];
    }

    log() {
        console.log(this.currentAdded);
        console.log(this.addedTracker);
    }

    get inviteIdentifiers() {
        return this.invites;
    }

    get current() {
        return this.currentAdded;
    }

    get valid() {
        return this.currentAdded < this.maxInvites;
    }

    get tracker() {
        return this.addedTracker;
    }
}
