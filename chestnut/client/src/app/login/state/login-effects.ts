import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '@shared/services/app-config.service';
import { PasswordLogin, Login, TokenResult } from './login-reducer';
import { of, Observable } from 'rxjs';
import { Effect, Actions } from '@ngrx/effects';
import { instanceOf } from 'ngrx-reducer-builder';
import { mergeMap, map } from 'rxjs/operators';
import { bindRemoteCall } from '@shared/bind-functions';
import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { LoginFailed, LoginSuccess } from '@shared/state/actions';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class LoginEffects {
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private appConfig: AppConfigService,
        private route: ActivatedRoute,
        private router: Router) { }

    @Effect()
    onLogin$ = this.actions$.pipe(
        instanceOf(Login),
        mergeMap(action => {
            return bindRemoteCall(() =>
                login(this.http, this.appConfig)({
                    client_id: 'chestnut_admin',
                    grant_type: 'password',
                    username: action.payload.username,
                    password: action.payload.password,
                })
            ).pipe(
                map(x =>
                    x.fold<Action>(
                        left => new LoginFailed(left),
                        right => {
                            this.router.navigate([this.route.snapshot.queryParams['returnUrl'] || '/']);
                            localStorage.setItem('token', JSON.stringify(right));
                            return new LoginSuccess({ username: action.payload.username });
                        }
                    )
                )
            );
        })
    );
}

const login = (http: HttpClient, appConfig: AppConfigService) => (data: PasswordLogin): Observable<TokenResult> =>
    http.post<TokenResult>(appConfig.buildIdentityUrl('/token'), data);

const fakeLogin = (http: HttpClient, appConfig: AppConfigService) => (data: PasswordLogin): Observable<TokenResult> =>
    of({
        token_type: 'bearer',
        access_token:
            // tslint:disable-next-line:max-line-length
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiMGVmYTA0Ny00YzYzLTRiZWUtYmIzZS01NDdhY2RhNDVkMzEiLCJpc3MiOiJodHRwOi8vMTcyLjMwLjMxLjUyIiwic3ViIjoiNWE1MzMyNGQyMzE3Yzk2MmUyOWU3NWM3IiwiZXhwIjoxNTM2MDU4Njk3LCJpYXQiOjE1MzYwNTUwOTcsIm5hbWUiOiJyb2dlci5ydWRpbkBsYW1iZGEtaXQuY2giLCJyb2xlcyI6WyJGb3RvQmV0cmFjaHRlciIsIkZvdG9SZWRha3RvciIsIlZpZGVvUmVkYWt0b3IiLCJUaGVtZW53ZWx0UmVkYWt0b3IiLCJNYW5kYW50ZW5BZG1pbmlzdHJhdG9yIiwiU3lzdGVtQWRtaW5pc3RyYXRvciJdLCJtYW5kYW50IjoiemVtIn0.078T1m4FyVZxWZw0R1V3 - H9XmboDwR1Umi0zR0cLgLQ',
        expires_in: 3600,
        refresh_token: 'acbaa5e4c774bd209d46e1fd911addd06771554b',
    });
