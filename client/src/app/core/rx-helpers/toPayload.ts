import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const toPayload = <T>() => (source: Observable<{ payload: T }>): Observable<T> =>
    source.pipe(map(x => x.payload));
