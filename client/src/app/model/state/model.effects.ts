import { Actions, Effect } from '@ngrx/effects';
import { instanceOf } from 'ngrx-reducer-builder';
import { map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ApplyColumnsChangedAction } from './model.reducer';

export class ColumnsChangedAction {
    public readonly type = 'COLUMNS_CHANGED';
    constructor(public payload: { [model: string]: string[] }) { }
}

@Injectable()
export class ModelEffects {

    constructor(private actions$: Actions) { }

    @Effect()
    onSelectedColumnsChanged$ = this.actions$.pipe(
        instanceOf(ColumnsChangedAction),
        tap(saveToLocalStorage),
        map(action => new ApplyColumnsChangedAction(action.payload))
    );
}

const saveToLocalStorage = (action: ColumnsChangedAction) => {
    const storedData = JSON.parse(localStorage.getItem('userVisibleColumns') || '{}');
    localStorage.setItem('userVisibleColumns', JSON.stringify({ ...storedData, ...action.payload }));
};
