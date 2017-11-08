import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { delay, flatMap, tap, map, withLatestFrom, filter, take } from 'rxjs/operators';
import { Http, Response, Headers, RequestOptions, RequestMethod, Request } from '@angular/http';
import { Router } from '@angular/router';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import { Store } from '@ngrx/store';
import * as fromModelData from '../reducers';
import * as modelDataAction from '../actions/model-data.actions';
import { ModelDescription } from '../../../../../common/metadata';
const client = new ApolloClient({
    link: new HttpLink({ uri: 'http://localhost:9000/chestnut/graphql' }),
    cache: new InMemoryCache(),
});

@Injectable()
export class ModelDataEffects {
    private baseUri = 'http://localhost:9000/chestnut/';
    constructor(
        private actions$: Actions,
        private http: Http,
        private router: Router,
        private store: Store<fromModelData.ModelDataState>
    ) {}

    @Effect()
    loadModelData$ = this.actions$.ofType<modelDataAction.LoadModelData>(modelDataAction.LOAD_MODEL_DATA).pipe(
        flatMap(action => {
            const modelName = action.payload.name.toLowerCase();
            return client
                .query({
                    query: this.composeManyQuery(action.payload, modelName),
                })
                .then(res => ({ res, modelName }));
        }),
        map(x => new modelDataAction.LoadModelDataSuccess(x.res.data[x.modelName + 'Many']))
    );

    private composeManyQuery(model: ModelDescription, modelName): string {
        const fields = model.properties.map(p => p.name);
        const query = gql`
            query get${modelName} {
                ${modelName}Many {
                    ${[...fields]}
                }
            }`;
        return query;
    }
}
