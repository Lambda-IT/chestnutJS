import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '@shared/services/app-config.service';
import { Effect, Actions } from '@ngrx/effects';
import { instanceOf } from 'ngrx-reducer-builder';
import { mergeMap, map, tap } from 'rxjs/operators';
import { bindRemoteCall, ErrorType } from '@shared/bind-functions';
import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { ApplyLoginFailedAction, ApplyLoginSuccessAction, TokenLoginAction, LogoutAction, ApplyLogoutAction } from '@shared/state/actions';
import { ActivatedRoute, Router } from '@angular/router';
import { userLogin, tokenLogin } from '../login.contracts';

export class UserLoginAction {
    readonly type = 'USER_LOGIN';
    constructor(public payload: { username: string; password: string }) { }
}

export class UserLoginFailedAction {
    readonly type = 'USER_LOGIN_FAILED';
    constructor(public payload: ErrorType) { }
}

@Injectable()
export class LoginEffects {
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private appConfig: AppConfigService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    @Effect()
    onUserLogin$ = this.actions$.pipe(
        instanceOf(UserLoginAction),
        mergeMap(action => {
            return bindRemoteCall(() =>
                userLogin(this.http, this.appConfig)({
                    client_id: 'chestnut_admin',
                    grant_type: 'password',
                    username: action.payload.username,
                    password: action.payload.password,
                })
            ).pipe(
                map(x =>
                    x.fold<Action>(
                        left => new ApplyLoginFailedAction(left),
                        right => {
                            this.router.navigate([this.route.snapshot.queryParams['returnUrl'] || '/']);
                            localStorage.setItem('token', JSON.stringify(right));
                            localStorage.setItem('user', JSON.stringify({ username: action.payload.username }));
                            return new ApplyLoginSuccessAction({ username: action.payload.username });
                        }
                    )
                )
            );
        })
    );

    @Effect()
    onUserLoginFailed$ = this.actions$.pipe(
        instanceOf(UserLoginFailedAction),
            map(x => {
                this.router.navigate(['/login']);
                return new ApplyLoginFailedAction(x.payload);
            })
    );

    @Effect()
    onTokenLogin$ = this.actions$.pipe(
        instanceOf(TokenLoginAction),
        mergeMap(action => {
            return bindRemoteCall(() =>
                tokenLogin(this.http, this.appConfig)({
                    client_id: 'chestnut_admin',
                    grant_type: 'refresh_token',
                    refresh_token: action.payload.refresh_token
                })
            ).pipe(
                map(x =>
                    x.fold<Action>(
                        left => new ApplyLoginFailedAction(left),
                        right => {
                            localStorage.setItem('token', JSON.stringify(right));
                            const user = <{ username: string }>JSON.parse(localStorage.getItem('user'));
                            return new ApplyLoginSuccessAction({ username: user.username });
                        }
                    )
                )
            );
        })
    );

    @Effect()
    onLogout$ = this.actions$.pipe(
        instanceOf(LogoutAction),
        tap(_ => localStorage.removeItem('token')),
        tap(_ => this.router.navigate(['./login'])),
        map(_ => new ApplyLogoutAction)
    );
}
