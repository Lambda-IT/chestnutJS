import { Option } from 'fp-ts/lib/Option';
import { Observable, Observer } from 'rxjs';

export const fromFilteredSome = () => <T>(source: Observable<Option<T>>): Observable<T> =>
    new Observable((observer: Observer<T>) => {
        return source.subscribe({
            next(x) {
                if (x.isSome()) {
                    observer.next(x.value);
                }
            },
            error(err) {
                observer.error(err);
            },
            complete() {
                observer.complete();
            },
        });
    });

export const fromFilteredNone = <R>(returnValue: R) => <T>(source: Observable<Option<T>>): Observable<R> =>
    new Observable((observer: Observer<R>) => {
        return source.subscribe({
            next(x) {
                if (x.isNone()) {
                    observer.next(returnValue);
                }
            },
            error(err) {
                observer.error(err);
            },
            complete() {
                observer.complete();
            },
        });
    });
