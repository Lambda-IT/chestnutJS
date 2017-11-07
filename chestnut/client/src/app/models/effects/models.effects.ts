import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { delay, flatMap, tap, map } from 'rxjs/operators';
import { Http, Response, Headers, RequestOptions, RequestMethod, Request } from '@angular/http';
import * as urlJoin from 'url-join';
import { Router } from '@angular/router';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

import * as models from '../actions/models.actions';

const client = new ApolloClient({
    link: new HttpLink({ uri: 'http://localhost:9000/graphql' }),
    cache: new InMemoryCache(),
});

@Injectable()
export class ModelsEffects {
    private baseUri = 'http://localhost:9000/chestnut/';
    constructor(private actions$: Actions, private http: Http, private router: Router) {}

    @Effect()
    loadModels$ = this.actions$
        .ofType<models.LoadModels>(models.LOAD_MODELS)
        .pipe(flatMap(() => this.get('metadata')), map(res => new models.LoadModelsSuccess(res.json()['models'])));

    @Effect()
    loadOneModel$ = this.actions$
        .ofType<models.LoadOneModel>(models.LOAD_ONE_MODEL)
        .pipe(
            flatMap(x => this.router.navigate([`modelview/${x.payload.name}`]).then(() => x)),
            map(x => new models.LoadOneModelSuccess(x.payload))
        );
    // Old Effect with graphql
    // @Effect()
    // loadModels$ = this.actions$.ofType<models.LoadModels>(models.LOAD_MODELS).pipe(
    //     flatMap(() =>
    //         client.query({
    //             query: gql`
    //                 query Models {
    //                     models {
    //                         id
    //                     }
    //                 }
    //             `,
    //         })
    //     ),
    //     map(x => new models.LoadModelsSuccess(x.data['models']))
    // );

    private get(endpoint: string) {
        return this.http.get(urlJoin(this.baseUri, endpoint)); // returns modelDescriptions
    }

    private post(url: string, body: any) {
        const headers = new Headers(body ? { 'Content-Type': 'application/json' } : {});
        const options = new RequestOptions({
            headers: headers,
            body: body ? JSON.stringify(body) : null,
            url: urlJoin(this.baseUri, url),
            method: RequestMethod.Post,
        });
        return this.http.request(new Request(options));
    }
}
