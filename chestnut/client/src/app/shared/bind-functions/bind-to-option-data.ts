import { ApolloQueryResult } from 'apollo-client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { fromNullable, Option } from 'fp-ts/lib/Option';

export const bindToOptionData = <T>(modelNameParam: string) => (
    source: Observable<ApolloQueryResult<T>>
): Observable<ApolloQueryResult<Option<T>>> =>
    source.pipe(map(p => ({ ...p, data: fromNullable(p.data).map(x => x[modelNameParam + 'ById']) }))) as Observable<
        ApolloQueryResult<Option<T>>
    >;
