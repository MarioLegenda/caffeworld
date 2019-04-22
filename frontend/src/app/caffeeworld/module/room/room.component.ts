import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import GetUserMedia from "../infrastructure/GetUserMedia";

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements AfterViewInit{
    @ViewChild('localVideo') localVideo: ElementRef;
    @ViewChild('remoteVideo') remoteVideo: ElementRef;

    ngAfterViewInit() {
        GetUserMedia.create({idealLow: true}).subscribe((stream) => {
            this.localVideo.nativeElement.volume = 0;
            this.localVideo.nativeElement.muted = 0;

            this.localVideo.nativeElement.srcObject = stream;
        })
    }
}
