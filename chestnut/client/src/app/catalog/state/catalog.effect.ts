import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { RouterNavigationAction, ROUTER_NAVIGATION } from '@ngrx/router-store';
import { RouterStateSnapshot } from '@angular/router';
import { CatalogPageComponent } from '../containers/catalog-page/catalog-page.component';
import { map, startWith, mergeMap, filter, catchError } from 'rxjs/operators';
import { findSnapshot } from '@shared/effects-helper';
import { AppConfigService } from '@shared/services/app-config.service';
import { Action } from '@ngrx/store';
import * as t from 'io-ts';
import { createOptionFromNullable } from 'io-ts-types/lib/fp-ts/createOptionFromNullable';
import { Either } from 'fp-ts/lib/Either';
import { CatalogDataLoading, CatalogDataLoaded } from './catalog.reducer';
import { bindRemoteCall, ErrorType } from '@shared/bind-functions';

const PropertiesInDtoRT = t.type({
    name: t.string,
    type: t.union([
        t.literal('String'),
        t.literal('Number'),
        t.literal('Boolean'),
        t.literal('Date'),
        t.literal('ObjectID'),
    ]),
    required: t.union([t.boolean, t.undefined]),
    enumValues: t.union([t.array(t.string), t.undefined]),
    regExp: t.union([createOptionFromNullable(t.string), t.undefined]),
    default: t.union([t.boolean, t.undefined]),
    reference: t.union([t.string, t.undefined]),
});

const ModelInDtoRT = t.type({
    name: t.string,
    properties: t.array(PropertiesInDtoRT),
});

const MetadataInDtoRT = t.type({
    models: t.array(ModelInDtoRT),
});

export interface PropertiesInDto extends t.TypeOf<typeof PropertiesInDtoRT> {}
export interface ModelInDto extends t.TypeOf<typeof ModelInDtoRT> {}
export interface MetadataInDto extends t.TypeOf<typeof MetadataInDtoRT> {}

@Injectable()
export class CatalogEffects {
    constructor(private actions$: Actions, private http: HttpClient, private appConfig: AppConfigService) {}

    @Effect()
    onInitModule$ = this.actions$.ofType<RouterNavigationAction<RouterStateSnapshot>>(ROUTER_NAVIGATION).pipe(
        map(a => findSnapshot(CatalogPageComponent, a.payload.routerState.root)),
        filter(x => x.isSome()),
        // map(x => right<ErrorType, ActivatedRouteSnapshot>(x.toNullable())), // for put calls
        mergeMap(_ =>
            bindRemoteCall(() => loadCatalog(this.http, this.appConfig)).pipe(
                // map(x => bindDecode(MetadataInDtoRT, jsonDecodeString)(x)),
                map(x => x.map(r => JSON.parse(r) as MetadataInDto)), // without validation
                map((result: Either<ErrorType, MetadataInDto>) => new CatalogDataLoaded(result)),
                startWith<Action>(new CatalogDataLoading())
            )
        )
    );
}

const loadCatalog = (http: HttpClient, appConfig: AppConfigService) =>
    http.get(appConfig.buildApiUrl('/metadata'), { responseType: 'text' });
