import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { delay, flatMap, tap, map, withLatestFrom, filter, take } from 'rxjs/operators';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import * as urlJoin from 'url-join';
import { ModelDescription, PropertyDescription } from '../../../../../common/metadata';
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
        map(action => action.payload),
        flatMap(id =>
            this.modelView$.pipe(
                take(1),
                map(modelViewData => ({
                    id,
                    modelView: modelViewData.modelView,
                }))
            )
        ),
        flatMap(x => {
            const modelView = x.modelView;
            const id = x.id;
            const modelName = modelView.name.toLowerCase();
            return client
                .query({
                    query: this.composeByIdQuery(id, modelName, modelView.properties),
                })
                .then(res => ({ res, modelName }));
        }),
        map(x => new modelDataAction.LoadModelDataSuccess(x.res.data[x.modelName + 'ById']))
    );

    private composeByIdQuery(id: string, modelName, properties: PropertyDescription[]): string {
        const fields = properties.map(p => p.name);

        const query = gql`
            query get${modelName}ById {
                ${modelName}ById(_id: "${id}"){
                    ${[...fields]}
                }
            }`;
        return query;
    }
}
