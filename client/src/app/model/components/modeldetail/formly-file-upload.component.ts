import { FieldType } from '@ngx-formly/material';
import {
    Component,
    OnInit,
    EventEmitter,
    ChangeDetectionStrategy,
    ViewChild,
    ElementRef,
    OnDestroy,
    ChangeDetectorRef,
} from '@angular/core';
import { map, takeUntil, tap } from 'rxjs/operators';
import { merge, Observable, Subject } from 'rxjs';
import { DeleteFileAction, SaveFileAction } from '../../state/model.effects';
import { Action, Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '@shared/services/app-config.service';
import { modelSelectors } from '../../state/model.reducer';
import { fromFilteredSome } from '@core/rx-helpers';

export interface SaveFileModel {
    id: string;
    file: File;
}

export interface DeleteFileModel {
    id: string;
    fileId: string;
}

@Component({
    selector: 'app-formly-file-upload',
    templateUrl: './formly-file-upload.component.html',
    styleUrls: ['./formly-file-upload.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFileUploadComponent extends FieldType implements OnInit, OnDestroy {
    savedFileId = this.store.select(modelSelectors.getFileId('id'));

    file = new EventEmitter<SaveFileModel>();
    deleteFile = new EventEmitter<DeleteFileModel>();

    @ViewChild('fileUpload') public fileUploadElement: ElementRef;

    accept = '*/*';

    protected onDestroy$ = new Subject();

    constructor(private store: Store<any>, private cdr: ChangeDetectorRef) {
        super();
        const fileSaveAction = this.file.pipe(map(file => new SaveFileAction({ id: file.id, file: file.file })));

        const fileDeleteAction = this.deleteFile.pipe(map(x => new DeleteFileAction({ id: x.id, fileId: x.fileId })));

        this.dispatch(fileSaveAction, fileDeleteAction);
    }

    onClick() {
        if (this.fileUploadElement.nativeElement.files.length > 0) {
            console.log('ERROR : Only one file can be uploaded');
        }
        this.fileUploadElement.nativeElement.onchange = () => {
            const file = this.fileUploadElement.nativeElement.files[0];
            this.file.emit({ id: 'id', file: file });
        };
        this.fileUploadElement.nativeElement.click();
    }

    getUrl() {
        const fileId = this.form.get('fileId').value;
        return `http://localhost:9000/chestnut/file/${fileId}`;
    }

    deleteFileClick() {
        const fileId = this.form.get('fileId').value;
        this.deleteFile.emit({ id: 'id', fileId: fileId });
        this.form.patchValue({ fileId: null }, { emitEvent: true });
    }

    dispatch(...o: Observable<Action>[]) {
        merge(...o)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(action => this.store.dispatch(action));
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
    }

    ngOnInit() {
        this.savedFileId
            .pipe(
                fromFilteredSome(),
                tap(x => {
                    this.form.patchValue({ fileId: x }, { emitEvent: true });
                    this.cdr.detectChanges();
                })
            )
            .subscribe();
    }
}
