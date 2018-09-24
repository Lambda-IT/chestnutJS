import { ReducerBuilder } from 'ngrx-reducer-builder';
import { createFeatureSelector, Action } from '@ngrx/store';
import { Option, none, some } from 'fp-ts/lib/Option';
import { ErrorType } from '@shared/bind-functions';
import { UserInfo, ApplyLoginSuccessAction, ApplyLoginFailedAction } from '@shared/state/actions';

export interface HeaderModel {
    isAuthenticated: boolean;
    userInfo: UserInfo;
}

export class UserLoginAction {
    readonly type = 'USER_LOGIN';
    constructor(public payload: { username: string; password: string }) {}
}

export interface LoginState {
    userInfo: Option<UserInfo>;
    error: Option<ErrorType>;
}

export const reducer = new ReducerBuilder<LoginState>()
    .handle(ApplyLoginSuccessAction, (state, action) => ({
        ...state,
        error: none,
        userInfo: some(action.payload),
    }))
    .handle(ApplyLoginFailedAction, (state, action) => ({
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
