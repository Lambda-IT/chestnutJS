import { Component, EventEmitter } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { AppConfigService } from '@shared/services/app-config.service';
import { FileUploadModel, initialFile } from '../../types';
import { ContainerComponent } from '@core/reactive-component/container-component';
import { Store } from '@ngrx/store';
import { DeleteFileAction, SaveFileAction } from '../../state/model.effects';
import { modelSelectors } from '../../state/model.reducer';

@Component({
    templateUrl: './formly-file-upload-page.component.html',
    styleUrls: ['./formly-file-upload-page.component.scss'],
})
export class FormlyFileUploadPageComponent extends ContainerComponent {
    param = 'file';
    target = this.appConfig.buildApiUrl('/file');

    reset$ = new EventEmitter<FileUploadModel>();
    file$ = new EventEmitter<File>();
    deleteFile$ = new EventEmitter<string>();

    public savedFileId$ = this.store.select(modelSelectors.getFileId);

    constructor(private store: Store<any>, private _http: HttpClient, private appConfig: AppConfigService) {
        super(store.dispatch.bind(store));

        const fileSaveAction = this.file$.pipe(
            map(file => {
                return new SaveFileAction(file);
            })
        );
        const fileDeleteAction = this.deleteFile$.pipe(map(fileId => new DeleteFileAction({ fileId: fileId })));

        this.dispatch(fileSaveAction, fileDeleteAction);
    }
}
