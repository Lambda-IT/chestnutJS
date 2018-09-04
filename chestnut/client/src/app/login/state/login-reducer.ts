import { ReducerBuilder } from 'ngrx-reducer-builder';
import { createFeatureSelector, Action } from '@ngrx/store';
import { Option, none, some } from 'fp-ts/lib/Option';
import { ErrorType } from '@shared/bind-functions';

export interface PasswordLogin {
    client_id: string;
    grant_type: 'password' | 'refresh_token';
    password: string;
    username: string;
}

export interface TokenResult {
    token_type: string;
    access_token: string;
    expires_in: number;
    refresh_token: string;
}

export class Login {
    readonly type = 'LOGIN';
    constructor(public payload: { username: string; password: string }) {}
}

export class LoginFailed {
    readonly type = 'LOGIN_FAILED';
    constructor(public payload: ErrorType) {}
}

export class LoginSuccess {
    readonly type = 'LOGIN_SUCCESS';
    constructor(public payload: UserInfo) {}
}

export interface UserInfo {
    username: string;
}

export interface LoginState {
    loggedIn: boolean;
    userInfo: Option<UserInfo>;
    error: Option<ErrorType>;
}

export const reducer = new ReducerBuilder<LoginState>()
    .handle(LoginSuccess, (state, action) => ({
        ...state,
        error: none,
        loggedIn: true,
        userInfo: some(action.payload),
    }))
    .handle(LoginFailed, (state, action) => ({
        ...state,
        error: some(action.payload),
    }))
    .build({
        error: none,
        loggedIn: false,
        userInfo: none,
    });

export const getModelState = createFeatureSelector<LoginState>('model');
export const loginSelectors = {};

export function loginReducer(state: LoginState, action: Action): LoginState {
    return reducer(state, action);
}
