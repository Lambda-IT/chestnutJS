import { ApolloQueryResult } from 'apollo-client';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { fromNullable, Option, none } from 'fp-ts/lib/Option';

export const bindToOptionData = <T>(modelNameParam: string) => (
    source: Observable<ApolloQueryResult<T>>
): Observable<ApolloQueryResult<Option<T>>> =>
    source.pipe(
        map(p => ({ ...p, data: fromNullable(p.data && p.data[modelNameParam + 'ById']) })),
        catchError(err => of({ errors: err.graphQLErrors, data: none }))
    ) as Observable<ApolloQueryResult<Option<T>>>;
