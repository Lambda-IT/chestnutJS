import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { map, filter, tap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { State } from './app.module';

@Injectable()
export class AppEffects {
    constructor(private actions$: Actions, private store: Store<State>) {}

    @Effect({ dispatch: false })
    onRootInit$ = this.actions$.pipe(
        withLatestFrom(this.store),
        map(([_, store]) => store),
        filter(x => x.app.loaded),
        tap(x => console.log('load app module', x.app))
        // TODO: load metadata
    );
}
