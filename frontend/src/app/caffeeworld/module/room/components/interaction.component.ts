import {AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import GetUserMedia from "../../infrastructure/GetUserMedia";

@Component({
    selector: 'app-interaction',
    templateUrl: './interaction.component.html',
    styleUrls: ['./interaction.component.scss'],
})
export class InteractionComponent implements AfterViewInit, OnDestroy {
    @ViewChild('localVideo') localVideo: ElementRef;

    @Input('onDestroy') onDestroy;
    @Input('onGetUserMediaCreated') onGetUserMediaCreated;

    private getUserMedia: GetUserMedia;

    ngAfterViewInit() {
        this.getUserMedia = GetUserMedia.create({idealLow: true});

        this.getUserMedia.subscribe((stream) => {
            if (this.onGetUserMediaCreated && this.onGetUserMediaCreated instanceof Function) {
                this.onGetUserMediaCreated.call(null, ...[stream]);

                return;
            }

            this.localVideo.nativeElement.volume = 0;
            this.localVideo.nativeElement.muted = 0;

            this.localVideo.nativeElement.srcObject = stream;
        });
    }

    ngOnDestroy(): void {
        if (this.onDestroy && this.onDestroy instanceof Function) {
            this.onDestroy.call(null, ...[this.getUserMedia, this.localVideo])
        }

        this.getUserMedia.destroy();
        this.getUserMedia = null;
        this.localVideo.nativeElement.srcObject = null;
        this.localVideo.nativeElement.remove();
    }
}
