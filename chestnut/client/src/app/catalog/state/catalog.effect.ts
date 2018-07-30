import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { RouterNavigationAction, ROUTER_NAVIGATION } from '@ngrx/router-store';
import { RouterStateSnapshot } from '@angular/router';
import { CatalogPageComponent } from '../containers/catalog-page/catalog-page.component';
import { map, startWith, mergeMap, tap } from 'rxjs/operators';
import { findSnapshot } from '@shared/effects-helper';
import { AppConfigService } from '@shared/services/app-config.service';
import { Action } from '@ngrx/store';
import * as t from 'io-ts';
import { createOptionFromNullable } from 'io-ts-types/lib/fp-ts/createOptionFromNullable';
import { of } from 'rxjs';


const PropertiesInDtoRT = t.type({
    name: t.string,
    type: t.string, // "String" | "Number" | "Boolean" | "Date" | "ObjectID"
    required: t.boolean, // can be undefined
    enumValues: t.array(t.string), // can be undefined
    regExp: createOptionFromNullable(t.string), // can be undefined
    default: t.boolean, // can be undefined
    reference: t.string // can be undefined
});


const ModelInDtoRT = t.type({
    name: t.string,
    properties: t.array(PropertiesInDtoRT)
});

const MetadataInDtoRT = t.type({
    models: t.array(ModelInDtoRT)
});

export interface PropertiesInDto extends t.TypeOf<typeof PropertiesInDtoRT> {}
export interface ModelInDto extends t.TypeOf<typeof ModelInDtoRT> {}
export interface MetadataInDto extends t.TypeOf<typeof MetadataInDtoRT> {}


@Injectable()
export class CatalogEffects {

    constructor(private actions$: Actions, private http: HttpClient, appConfig: AppConfigService) {}

    @Effect()
    onInitModule$ = this.actions$
        .ofType<RouterNavigationAction<RouterStateSnapshot>>(ROUTER_NAVIGATION)
        .pipe(
            map(a => findSnapshot(CatalogPageComponent, a.payload.routerState.root)),
            mergeMap(option => option.isSome() ?
                loadCatalog(this.http).pipe(
                    map(result =>  <Action>{ type: 'Successfull'}),
                    startWith<Action>(<Action>{ type: 'loading' })
                ) : of(<Action>{ type: 'dfsdg'})
            )
        );
}

const loadCatalog = (http: HttpClient) => http.get<MetadataInDto>('http://localhost:9000/chestnut/metadata');
