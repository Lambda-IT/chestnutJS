import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { map, filter, tap, withLatestFrom, mergeMap, startWith } from 'rxjs/operators';
import { Store, Action } from '@ngrx/store';
import { State } from './app.module';
import { AppConfigService } from '@shared/services/app-config.service';
import { HttpClient } from '@angular/common/http';
import { bindRemoteCall } from '@shared/bind-functions';
import { ModelDescription } from '../../../common/metadata';
import { MetadataLoaded, MetadataLoading } from '@shared/actions';
import { instanceOf } from 'ngrx-reducer-builder';
import { Login, LoginFailed, LoginSuccess, PasswordLogin } from './app.reducer';
import { of } from 'rxjs';

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

    @Effect()
    onLogin$ = this.actions$.pipe(
        instanceOf(Login),
        mergeMap(action => {
            return bindRemoteCall(() =>
                fakeLogin(this.http, this.appConfig)({
                    client_id: 'chestnut_admin',
                    grant_type: 'password',
                    username: action.payload.username,
                    password: action.payload.password,
                })
            );
        }),
        map(x =>
            x.fold<Action>(
                _ => new LoginFailed(),
                right => {
                    localStorage.setItem('token', JSON.stringify(right));
                    return new LoginSuccess(right);
                }
            )
        )
    );
}

const loadCatalog = (http: HttpClient, appConfig: AppConfigService) =>
    http.get<MetadataDto>(appConfig.buildApiUrl('/metadata'));

const login = (http: HttpClient, appConfig: AppConfigService) => (data: PasswordLogin) =>
    http.post(appConfig.buildApiUrl('/auth/token'), data);

const fakeLogin = (http: HttpClient, appConfig: AppConfigService) => (data: PasswordLogin) =>
    of({
        token_type: 'bearer',
        access_token:
            // tslint:disable-next-line:max-line-length
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiMGVmYTA0Ny00YzYzLTRiZWUtYmIzZS01NDdhY2RhNDVkMzEiLCJpc3MiOiJodHRwOi8vMTcyLjMwLjMxLjUyIiwic3ViIjoiNWE1MzMyNGQyMzE3Yzk2MmUyOWU3NWM3IiwiZXhwIjoxNTM2MDU4Njk3LCJpYXQiOjE1MzYwNTUwOTcsIm5hbWUiOiJyb2dlci5ydWRpbkBsYW1iZGEtaXQuY2giLCJyb2xlcyI6WyJGb3RvQmV0cmFjaHRlciIsIkZvdG9SZWRha3RvciIsIlZpZGVvUmVkYWt0b3IiLCJUaGVtZW53ZWx0UmVkYWt0b3IiLCJNYW5kYW50ZW5BZG1pbmlzdHJhdG9yIiwiU3lzdGVtQWRtaW5pc3RyYXRvciJdLCJtYW5kYW50IjoiemVtIn0.078T1m4FyVZxWZw0R1V3 - H9XmboDwR1Umi0zR0cLgLQ',
        expires_in: 3600,
        refresh_token: 'acbaa5e4c774bd209d46e1fd911addd06771554b',
    });
