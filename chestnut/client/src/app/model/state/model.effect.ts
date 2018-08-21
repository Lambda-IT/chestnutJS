import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { RouterNavigationAction, ROUTER_NAVIGATION } from '@ngrx/router-store';
import { RouterStateSnapshot } from '@angular/router';
import { map, tap, mergeMap } from 'rxjs/operators';
import { findSnapshot, fromFilteredSome } from '@shared/effects-helper';
import { ModelPageComponent } from '../containers/model-page/model-page.component';
import { Apollo } from 'apollo-angular';
import { composeManyQuery } from '@shared/graphql';

@Injectable()
export class ModelEffects {
    constructor(private actions$: Actions, private apollo: Apollo) {}

    @Effect({ dispatch: false })
    onInitModule$ = this.actions$.ofType<RouterNavigationAction<RouterStateSnapshot>>(ROUTER_NAVIGATION).pipe(
        map(a => findSnapshot(ModelPageComponent, a.payload.routerState.root)),
        fromFilteredSome(),
        // TODO: select params from store
        map(s => ({ modelName: s.params['modelName'], id: s.params['id'] })),
        tap(x => console.log('model selected', x)),
        mergeMap(
            x =>
                this.apollo.watchQuery({
                    query: composeManyQuery(x.modelName, ['description']),
                }).valueChanges
        )
    );
}
