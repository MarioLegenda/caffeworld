import {Injectable} from '@angular/core';

@Injectable()
export default class InvitationService {
    private currentAdded = 0;
    private addedTracker = [];
    private invitations = {};
    private emailValidRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    private initCurrentAdded = this.currentAdded;

    constructor(private maxInvites: number) {}

    init(currentAdded: number): void {
        this.currentAdded = currentAdded;
        this.addedTracker.push(currentAdded);
        this.initCurrentAdded = currentAdded;
    }

    addInvitation($event: any, index: number): void {
        this.invitations[index] = $event.target.value;

    }

    isInvitationValidByIndex(index): boolean {
        return this.emailValidRegex.test(this.getInvitation(index));
    }

    isInvitationValidByString(invitation: string): boolean {
        return this.emailValidRegex.test(invitation);
    }

    getInvitation(index): string {
        return this.invitations[index];
    }

    hasInvitation(index): boolean {
        return this.invitations.hasOwnProperty(index);
    }

    remove(index: number): void {
        this.addedTracker.splice(this.addedTracker.indexOf(index), 1);
        this.currentAdded--;

        if (this.invitations.hasOwnProperty(index)) delete this.invitations[index];
    }

    update(): void {
        if (this.valid) {
            this.currentAdded++;
            this.addedTracker.push(this.currentAdded);
        }
    }

    clear(): void {
        this.currentAdded = this.initCurrentAdded;
        this.addedTracker = [];
    }

    get current(): number {
        return this.currentAdded;
    }

    get valid(): boolean {
        return this.currentAdded < this.maxInvites;
    }

    get tracker(): number[] {
        return this.addedTracker;
    }

    get onInvitationChange(): object {
        return this.invitations;
    }

    get asArray(): string[] {
        const values = (Object as any).values(this.invitations);

        return values.filter((email) => {
            return this.isInvitationValidByString(email);
        })
    }
}
