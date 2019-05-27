import { Injectable } from '@angular/core';
import { AppConfigService } from '@shared/services/app-config.service';
import { HttpClient } from '@angular/common/http';
import { tokenLogin } from '../login.contracts';
import { Store } from '@ngrx/store';
import { ApplyLoginSuccessAction } from '@shared/state/actions';
import { bindRemoteCall } from '@shared/bind-functions';
import { tap } from 'rxjs/operators';
import { UserLoginFailedAction } from '../state/login-effects';

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    constructor(private configService: AppConfigService, private http: HttpClient, private store: Store<any>) {}

    tokenLogin(refreshToken: string) {
        return bindRemoteCall(() =>
            tokenLogin(this.http, this.configService)({
                client_id: 'chestnut_admin',
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            })
        ).pipe(
            tap(x =>
                x.fold(
                    l => this.store.dispatch(new UserLoginFailedAction(l)),
                    r => {
                        localStorage.setItem('token', JSON.stringify(r));
                        const user = <{ username: string }>JSON.parse(localStorage.getItem('user'));
                        return this.store.dispatch(new ApplyLoginSuccessAction({ username: user.username }));
                    }
                )
            )
        );
    }
}
