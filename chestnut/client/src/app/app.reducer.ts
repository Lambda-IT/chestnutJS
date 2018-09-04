import { ReducerBuilder } from 'ngrx-reducer-builder';
import { none, Option, some } from 'fp-ts/lib/Option';
import { ErrorType } from '@shared/bind-functions';
import { MetadataLoading, MetadataLoaded, MetadataDto } from '@shared/actions';
import { Action, createFeatureSelector, createSelector } from '@ngrx/store';

export interface AppState {
    loaded: boolean;
    loading: boolean;
    error: Option<ErrorType>;
    model: Option<MetadataDto>;
}

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
    constructor() {}
}

export class LoginSuccess {
    readonly type = 'LOGIN_SUCCESS';
    constructor(public payload: TokenResult) {}
}

export const reducer = new ReducerBuilder<AppState>()
    .handle(MetadataLoading, (state, action) => ({
        ...state,
        loading: true,
    }))
    .handle(MetadataLoaded, (state, action) => ({
        ...state,
        ...action.payload.fold<AppState>(
            l => ({ loaded: false, loading: false, error: some(l), model: none }),
            r => ({ loaded: true, loading: false, model: some(r), error: none })
        ),
    }))
    .build({
        loaded: false, // indicate that data are ready
        loading: false, // indicate Loading
        error: none,
        model: none,
    });

export const getAppState = createFeatureSelector<AppState>('app');
export const modelSelectors = {
    error: createSelector(getAppState, state => state.error),
};

export function appReducer(state: AppState, action: Action): AppState {
    return reducer(state, action);
}
