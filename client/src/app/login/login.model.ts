import { Option } from 'fp-ts/lib/Option';

export interface HeaderModel {
    isAuthenticated: boolean;
    userInfo: Option<UserInfo>;
}

export interface UserInfo {
    username: string;
}
