import { ReducerBuilder } from 'ngrx-reducer-builder';
import { createFeatureSelector, Action, createSelector } from '@ngrx/store';
import { Option, none, some } from 'fp-ts/lib/Option';
import { ErrorType } from '@shared/bind-functions';
import { ApplyLoginSuccessAction, ApplyLoginFailedAction, ApplyLogoutAction } from '@shared/state/actions';

export class UserLoginAction {
    readonly type = 'USER_LOGIN';
    constructor(public payload: { username: string; password: string }) { }
}

export interface UserInfo {
    username: string;
}

export interface LoginPageState {
    userInfo: Option<UserInfo>;
    error: Option<ErrorType>;
}

export const reducer = new ReducerBuilder<LoginPageState>()
    .handle(ApplyLoginSuccessAction, (state, action) => ({
        ...state,
        error: none,
        userInfo: some(action.payload),
    }))
    .handle(ApplyLoginFailedAction, (state, action) => ({
        ...state,
        error: some(action.payload),
        userInfo: none,
    }))
    .handle(ApplyLogoutAction, (state, action) => ({
        ...state,
        error: none,
        userInfo: none
    }))
    .build({
        error: none,
        userInfo: none,
    });

export const getLoginState = createFeatureSelector<LoginPageState>('login');
export const loginSelectors = {
    headerModel: createSelector(getLoginState, state => ({ isAuthenticated: state.userInfo.isSome(), userInfo: state.userInfo })),
    error: createSelector(getLoginState, state =>
        state.error.map(e => {
            if (ErrorType.is.APIErrorResponse(e)) {
                if (e.value.apiErrorResponse.error.type === 'ModelError') {
                    return e.value.apiErrorResponse.error.message;
                } else {
                    const error = e.value.apiErrorResponse.error;
                    return `${error.message}: ${error.fieldErrors.reduce((acc: string, err) => acc + err.message, '')}`;
                }
            }
        })
    )
};

export function loginReducer(state: LoginPageState, action: Action): LoginPageState {
    return reducer(state, action);
}
