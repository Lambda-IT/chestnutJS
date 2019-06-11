import { Actions, Effect } from '@ngrx/effects';
import { instanceOf } from 'ngrx-reducer-builder';
import { map, switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ApplyColumnsChangedAction, ApplyDeleteFileAction, ApplySavedFileAction } from './model.reducer';
import { makeRemoteDataCall } from '@core/effects-helper';
import { ModelService } from '../services/model-service';
import { toPayload } from '@core/rx-helpers';

export class ColumnsChangedAction {
    public readonly type = 'COLUMNS_CHANGED';
    constructor(public payload: { [model: string]: string[] }) {}
}

export class SaveFileAction {
    public readonly type = 'SAVE_FILE';
    constructor(public payload: { id: string; file: File }) {}
}

export class DeleteFileAction {
    public readonly type = 'DELETE_FILE';
    constructor(public payload: { id: string; fileId: string }) {}
}

@Injectable()
export class ModelEffects {
    constructor(private actions$: Actions, private modelService: ModelService) {}

    @Effect()
    onSelectedColumnsChanged$ = this.actions$.pipe(
        instanceOf(ColumnsChangedAction),
        tap(saveToLocalStorage),
        map(action => new ApplyColumnsChangedAction(action.payload))
    );

    @Effect()
    onSavedFile$ = this.actions$.pipe(
        instanceOf(SaveFileAction),
        toPayload(),
        switchMap(payload =>
            makeRemoteDataCall(this.modelService.saveFileToDb(payload.file), response => {
                if (response.data.isSome) {
                    return new ApplySavedFileAction({
                        key: payload.id,
                        data: response.data.map(x => x.fileId).getOrElse(''),
                    });
                }
            })
        )
    );

    @Effect()
    onDeleteFile$ = this.actions$.pipe(
        instanceOf(DeleteFileAction),
        toPayload(),
        switchMap(payload =>
            makeRemoteDataCall(
                this.modelService.deleteFileFromDb(payload.fileId),
                respond => new ApplyDeleteFileAction({ key: payload.id })
            )
        )
    );
}

const saveToLocalStorage = (action: ColumnsChangedAction) => {
    const storedData = JSON.parse(localStorage.getItem('userVisibleColumns') || '{}');
    localStorage.setItem('userVisibleColumns', JSON.stringify({ ...storedData, ...action.payload }));
};
