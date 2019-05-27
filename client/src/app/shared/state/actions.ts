import { Either } from 'fp-ts/lib/Either';
import { ErrorType } from '@shared/bind-functions';
import { MetadataDto } from '../../../../../common/metadata';

export class ApplyUserVisibleColumnsAction {
    readonly type = 'APPLY_USERVISIBLECOLUMNS';
    constructor(public payload: { [key: string]: string[] }) {}
}

export class ApplyMetadataLoadedAction {
    readonly type = 'APPLY_CATALOG_DATA_LOADED';
    constructor(public payload: Either<ErrorType, MetadataDto>) {}
}

export class ApplyMetadataLoadingAction {
    readonly type = 'APPLY_CATALOG_DATA_LOADING';
}

export class ApplyLoginFailedAction {
    readonly type = 'APPLY_LOGIN_FAILED';
    constructor(public payload: ErrorType) {}
}

export class ApplyLoginSuccessAction {
    readonly type = 'APPLY_LOGIN_SUCCESS';
    constructor(public payload: { username: string }) {}
}

export class ApplyLogoutAction {
    readonly type = 'APPLY_LOGOUT';
}

export class TokenLoginAction {
    readonly type = 'TOKEN_LOGIN';
    constructor(public payload: { refresh_token: string }) {}
}

export class LogoutAction {
    readonly type = 'LOGOUT';
}
