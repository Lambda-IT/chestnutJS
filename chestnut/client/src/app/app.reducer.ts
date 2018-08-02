import { ReducerBuilder } from '@shared/ngx-tools';
import { none, Option } from 'fp-ts/lib/Option';
import { ErrorType } from '@shared/bind-functions';

export interface AppState {
    model: any;
    loaded: boolean;
    loading: boolean;
    error: Option<ErrorType>;
}

export const appReducer = new ReducerBuilder<AppState>().build({
    model: [],
    loaded: false, // indicate that data are ready
    loading: false, // indicate Loading
    error: none,
});
