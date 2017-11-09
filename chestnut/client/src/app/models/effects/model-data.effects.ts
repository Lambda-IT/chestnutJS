import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { delay, flatMap, tap, map, withLatestFrom, filter, take } from 'rxjs/operators';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import * as urlJoin from 'url-join';
import { ModelDescription } from '../../../../../common/metadata';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../reducers';
import * as fromModels from '../reducers/models.reducer';
import * as modelDataAction from '../actions/modeldata.actions';
const client = new ApolloClient({
    link: new HttpLink({ uri: 'http://localhost:9000/chestnut/graphql' }),
    cache: new InMemoryCache(),
});

@Injectable()
export class ModelDataEffects {
    private baseUri = 'http://localhost:9000/chestnut/';
    constructor(private actions$: Actions, private router: Router, private store: Store<fromRoot.State>) {}

    private modelView$ = this.store.select(fromRoot.getModelview).pipe(filter(x => x !== null));
    @Effect()
    loadModelData$ = this.actions$.ofType<modelDataAction.LoadModelData>(modelDataAction.LOAD_MODEL_DATA).pipe(
        map(action => {
            const id = action.payload;
        })
    );
}
