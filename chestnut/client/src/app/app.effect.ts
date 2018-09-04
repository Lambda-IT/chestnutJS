import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { map, filter, tap, withLatestFrom, mergeMap, startWith } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { State } from './app.module';
import { AppConfigService } from '@shared/services/app-config.service';
import { HttpClient } from '@angular/common/http';
import { bindRemoteCall } from '@shared/bind-functions';
import { ModelDescription } from '../../../common/metadata';
import { MetadataLoaded, MetadataLoading } from '@shared/actions';

export interface MetadataDto {
    models: ModelDescription[];
}

@Injectable()
export class AppEffects {
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<State>,
        private appConfig: AppConfigService
    ) {}

    @Effect()
    onRootInit$ = this.actions$.pipe(
        withLatestFrom(this.store),
        map(([_, store]) => store),
        filter(x => !x.app.loading && !x.app.loaded),
        tap(x => console.log('load app module', x.app)),
        mergeMap(_ =>
            bindRemoteCall(() => loadCatalog(this.http, this.appConfig)).pipe(
                // map(x => bindDecode(MetadataInDtoRT, jsonDecodeString)(x)),
                map(result => new MetadataLoaded(result)),
                startWith(new MetadataLoading())
            )
        )
    );
}

const loadCatalog = (http: HttpClient, appConfig: AppConfigService) =>
    http.get<MetadataDto>(appConfig.buildApiUrl('/metadata'));
