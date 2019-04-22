import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import GetUserMedia from "../../infrastructure/GetUserMedia";

@Component({
    selector: 'app-interaction',
    templateUrl: './interaction.component.html',
    styleUrls: ['./interaction.component.scss'],
})
export class InteractionComponent implements AfterViewInit, OnDestroy {
    @ViewChild('localVideo') localVideo: ElementRef;

    private getUserMedia: GetUserMedia;

    ngAfterViewInit() {
        this.getUserMedia = GetUserMedia.create({idealLow: true});

        this.getUserMedia.subscribe((stream) => {
            this.localVideo.nativeElement.volume = 0;
            this.localVideo.nativeElement.muted = 0;

            this.localVideo.nativeElement.srcObject = stream;
        })
    }

    ngOnDestroy(): void {
        this.getUserMedia.destroy();
        this.getUserMedia = null;
        this.localVideo.nativeElement.srcObject = null;
        this.localVideo.nativeElement.remove();
    }
}
