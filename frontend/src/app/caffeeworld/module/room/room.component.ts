import {Component, OnDestroy, OnInit} from '@angular/core';
import {RoomIdentifier} from "../infrastructure/RoomIdentifier";
import Socket from "../../infrastructure/socket/Socket";
import IInput from "../../infrastructure/event/IInput";
import {Input} from "../../infrastructure/event/Input";
import {Output} from "../../infrastructure/event/Output";
import IOutput from "../../infrastructure/event/IOutput";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit, OnDestroy {
    /**
     * Controls the DOM. <app-media-box> is created if this object has any values
     * in it. Those values are [key, value] = [socket.id, socket.id]. fnTrackBy() method
     * is required so that the DOM is not recreated on every change
     */
    members = {};

    private newMember: string;
    initRoomDom = false;
    private isLocal: boolean = false;

    private roomData: any;

    constructor(
        private input: Input,
        private output: Output,
        private roomIdentifier: RoomIdentifier,
        private modalService: NgbModal,
    ) {}

    fnTrackBy(index, item) {
        return item.value;
    }

    ngOnInit(): void {
        this.keepConnAlive();

        Socket.room.on('connect', () => {
            console.log(`Current socket id is: ${Socket.roomId}`);

            // Inits the dom only when the socket is connected
            this.initRoomDom = true;
            /**
             * An event is sent to the server that the room is entered.
             * This event triggers the input.onRoomUpdated just below.
             * Its only purpose is to make the server do the work of
             * figuring out how many participants are there in the conversation
             * and return that data
             */
            this.output.sendRoomEntered(this.roomIdentifier);

            /**
             * An 'event' object has this structure:
             *
             * {
             *     body: {
             *         room: {
             *             members: {
             *                 count: integer // the number of members in this room
             *                 list: array // a list of members (socket ids)
             *                 new_member: null | string // a socket id if there is a new member in this room, null otherwise
             *             }
             *             identifier: string // room identifier, you can see it in the url, extracted from url
             *             path: string // the path portion of the url
             *             url: string // full url
             *         },
             *         table: {
             *             nickname: string,
             *             subject: string,
             *             subjectDescription: string,
             *             briefDescription: string
             *         }
             *     }
             *     http: null,
             *     socket: null,
             *     transportType: 2
             * }
             *
             * 'http' and 'socket' are my experimentations. I wanted to create a layer on the backend that is transport type
             * agnostic. The services using that layer would not know if they got the data from http or socket.
             * I didn't implemented it because I wanted to make it simple so I just went along with simple functions.
             * It was interesting for me to do it with Typescript. Those field would have data particular for that
             * transport type.
             *
             * 'members' object has the metadata about the members in the group.
             *
             *
             */
            this.input.onRoomUpdated((event) => {
                console.log(`room_updated event entered.`, event);

                this.roomData = this.assignDefault(event.body.table);

                const room = event.body.room;

                // if the number of members is 1, this is the callee
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

                // if the number of members is more than one, create a new member
                // only if it is not the current member and the member is not already created
                if (room.members.count > 1) {
                    console.log(`Multiple members found. Number of members is ${room.members.count}`);
                    for (const member of members) {
                        if (Socket.roomId !== member && !this.members.hasOwnProperty(member)) {
                            this.members[member] = member;

                            console.log(`Added member-box with id ${member}`);
                        }
                    }
                }

                // Clear all members in DOM if there are no more members
                if (room.members.count === 0) {
                    console.log(`There are no members in the room. Clearing the DOM`);

                    this.members = {};
                }

                // This is the new member which means it is the caller
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

    /**
     * Show the about modal
     *
     * @param aboutContent
     */
    showAboutModal(aboutContent) {
        this.modalService.open(aboutContent);
    }

    /**
     * @param roomData
     *
     * Assigns '-' sign to data that is left blank by the user
     */
    private assignDefault(roomData) {
        for (const d of Object.keys(roomData)) {
            if (!roomData[d]) {
                roomData[d] = '-';
            }
        }

        return roomData;
    }

    /**
     * The socket connection kept going away after being idle for a couple of minutes.
     * This keeps it alive
     */
    private keepConnAlive() {
        setInterval(() => {
            Socket.room.emit('peng');
        }, 10000);

        Socket.room.on('pung', () => {});
    }
}
