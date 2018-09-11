import { ReducerBuilder } from 'ngrx-reducer-builder';
import { createFeatureSelector, Action } from '@ngrx/store';
import { Option, none, some } from 'fp-ts/lib/Option';
import { ErrorType } from '@shared/bind-functions';
import { UserInfo, LoginSuccess, LoginFailed } from '@shared/state/actions';

export interface PasswordLogin {
    client_id: string;
    grant_type: 'password';
    password: string;
    username: string;
}

export interface RefreshTokenLogin {
    client_id: string;
    grant_type: 'refresh_token';
    refresh_token: string;
}

export interface TokenResult {
    token_type: string;
    access_token: string;
    expires_in: number;
    refresh_token: string;
}

export class UserLogin {
    readonly type = 'USER_LOGIN';
    constructor(public payload: { username: string; password: string }) {}
}

export interface LoginState {
    userInfo: Option<UserInfo>;
    error: Option<ErrorType>;
}

export const reducer = new ReducerBuilder<LoginState>()
    .handle(LoginSuccess, (state, action) => ({
        ...state,
        error: none,
        userInfo: some(action.payload),
    }))
    .handle(LoginFailed, (state, action) => ({
        ...state,
        error: some(action.payload),
    }))
    .build({
        error: none,
        userInfo: none,
    });

export const getLoginState = createFeatureSelector<LoginState>('login');
export const loginSelectors = {
};

export function loginReducer(state: LoginState, action: Action): LoginState {
    return reducer(state, action);
}
