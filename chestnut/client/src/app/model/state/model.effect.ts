import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { RouterNavigationAction, ROUTER_NAVIGATION } from '@ngrx/router-store';
import { RouterStateSnapshot } from '@angular/router';
import { map, filter, tap, mergeMap } from 'rxjs/operators';
import { findSnapshot } from '@shared/effects-helper';
import { ModelPageComponent } from '../containers/model-page/model-page.component';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable()
export class ModelEffects {
    constructor(
        private actions$: Actions,
        private apollo: Apollo) { }

    @Effect({ dispatch: false })
    onInitModule$ = this.actions$.ofType<RouterNavigationAction<RouterStateSnapshot>>(ROUTER_NAVIGATION).pipe(
        map(a => findSnapshot(ModelPageComponent, a.payload.routerState.root)),
        filter(x => x.isSome()),
        map(s => s.map(a => a.params['id'])),
        tap(x => console.log('sdkfhsdjhghdshgh', x['value'])),
        mergeMap(x => this.apollo.watchQuery({
            query: gql` { todoMany {
                description
                completed
                user
              }}`
        }).valueChanges)
        // query graphql
    );
}
