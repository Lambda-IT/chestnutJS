import { FieldType } from '@ngx-formly/material';
import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
    ViewChild,
    ElementRef,
} from '@angular/core';
import { tap } from 'rxjs/operators';
import { FileUploadModel, SaveFileResponse } from '../../types';
import { ChestnutRemoteData } from '@core/remote-data';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-formly-file-upload',
    templateUrl: './formly-file-upload.component.html',
    styleUrls: ['./formly-file-upload.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFileUploadComponent extends FieldType implements OnInit {
    @Input() savedFileId: Observable<ChestnutRemoteData<SaveFileResponse>>;
    @Input() reset: EventEmitter<FileUploadModel>;

    @Output() file: EventEmitter<File> = new EventEmitter<File>();
    @Output() deleteFile = new EventEmitter<string>();

    @ViewChild('fileUpload') public fileUploadElement: ElementRef;

    accept = '*/*';

    constructor() {
        super();
    }

    onClick() {
        if (this.fileUploadElement.nativeElement.files.length > 0) {
            console.log('ERROR : Only one file can be uploaded');
        }
        this.fileUploadElement.nativeElement.onchange = () => {
            const file = this.fileUploadElement.nativeElement.files[0];
            this.file.emit(file);
        };
        this.fileUploadElement.nativeElement.click();
    }

    getUrl(fileId: string) {
        return `http://localhost:9000/chestnut/file/${fileId}`;
    }

    ngOnInit() {
        this.reset
            .pipe(
                tap(x => {
                    this.fileUploadElement.nativeElement.value = '';
                })
            )
            .subscribe(x => console.log('Subscribe', x));
    }
}
