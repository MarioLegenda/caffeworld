import {Component, OnDestroy, OnInit} from '@angular/core';
import RoomIdentifier from "../infrastructure/RoomIdentifier";
import Socket from "../../infrastructure/socket/Socket";
import IInput from "../../infrastructure/event/IInput";
import {Input} from "../../infrastructure/event/Input";
import Output from "../../infrastructure/event/Output";
import IOutput from "../../infrastructure/event/IOutput";

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit, OnDestroy {
    members = {};

    private readonly input: IInput;
    private readonly output: IOutput;

    private newMember: string;
    private initRoomDom = false;
    private isLocal: boolean = false;

    constructor(
        input: Input,
        output: Output,
        private roomIdentifier: RoomIdentifier,
    ) {
        this.input = input as IInput;
        this.output = output as IOutput;
    }

    fnTrackBy(index, item) {
        return item.value;
    }

    ngOnInit(): void {
        this.keepConnAlive();

        Socket.room.on('connect', () => {
            console.log(`Current socket id is: ${Socket.roomId}`);

            this.initRoomDom = true;
            this.output.sendRoomEntered(this.roomIdentifier);

            this.input.onRoomUpdated((event) => {
                console.log(`room_updated event entered.`, event);

                const room = event.body.room;

                if (room.members.count === 1) {
                    this.isLocal = true;

                    // if there is only one member left after the previous member has left,
                    // delete the DOM and wait for the next call
                    if (Object.keys(this.members).length === 1) {
                        this.members = {};
                    }

                    console.log(`This is the only member in the room`);
                }

                const members = room.members.list;

                if (room.members.count > 1) {
                    console.log(`Multiple members found. Number of members is ${room.members.count}`);
                    for (const member of members) {
                        if (Socket.roomId !== member && !this.members.hasOwnProperty(member)) {
                            this.members[member] = member;

                            console.log(`Added member-box with id ${member}`);
                        }
                    }
                }

                if (room.members.count === 0) {
                    console.log(`There are no members in the room. Clearing the DOM`);

                    this.members = {};
                }

                this.newMember = room.members.new_member;

                if (this.newMember) {
                    console.log(`New member found with identifier ${this.newMember}`);
                }
            });
        });
    }

    ngOnDestroy(): void {
        this.members = {};
    }

    private keepConnAlive() {
        setInterval(() => {
            Socket.room.emit('peng');
        }, 10000);

        Socket.room.on('pung', () => {});
    }
}
