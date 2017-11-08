import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { delay, flatMap, tap, map, withLatestFrom, filter, take } from 'rxjs/operators';
import { Http, Response, Headers, RequestOptions, RequestMethod, Request } from '@angular/http';
import * as urlJoin from 'url-join';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromModels from '../reducers';
import * as models from '../actions/models.actions';

@Injectable()
export class ModelsEffects {
    private baseUri = 'http://localhost:9000/chestnut/';
    constructor(
        private actions$: Actions,
        private http: Http,
        private router: Router,
        private store: Store<fromModels.ModelsState>
    ) {}
    private models$ = this.store.select(fromModels.getModels).pipe(filter(x => x !== null));

    modelNameClicked$ = this.actions$
        .ofType<models.ClickModelName>(models.CLICK_MODEL_NAME)
        .subscribe(action => this.router.navigate([`modelview/${action.payload}`]));

    @Effect()
    loadModels$ = this.actions$
        .ofType<models.LoadModels>(models.LOAD_MODELS)
        .pipe(flatMap(() => this.get('metadata')), map(res => new models.LoadModelsSuccess(res.json()['models'])));

    @Effect()
    loadOneModel$ = this.actions$.ofType<models.LoadOneModel>(models.LOAD_ONE_MODEL).pipe(
        map(action => action.payload),
        flatMap(modelName =>
            this.models$.pipe(
                take(1),
                map(allModels => ({
                    modelName,
                    allModels,
                }))
            )
        ),
        map(x => {
            const modelview = x.allModels.find(m => m.name === x.modelName);
            return new models.LoadOneModelSuccess(modelview);
        })
    );
    // Model only header loading
    // @Effect()
    // loadOneModel$ = this.actions$.ofType<models.LoadOneModel>(models.LOAD_ONE_MODEL).pipe(
    //     map(action => action.payload),
    //     flatMap(modelName =>
    //         this.models$.pipe(
    //             take(1),
    //             map(allModels => ({
    //                 modelName,
    //                 allModels,
    //             }))
    //         )
    //     ),
    //     map(x => {
    //         const modelview = x.allModels.find(m => m.name === x.modelName);
    //         return new models.LoadOneModelSuccess(modelview);
    //     })
    // );

    // -- API CALLS-----
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
