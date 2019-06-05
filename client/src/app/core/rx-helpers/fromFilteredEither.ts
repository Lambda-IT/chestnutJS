import { Either } from 'fp-ts/lib/Either';
import { Observable } from 'rxjs';

export const fromFilteredRight = () => <L, R>(source: Observable<Either<L, R>>): Observable<R> =>
    new Observable(observer => {
        return source.subscribe({
            next(x) {
                if (x.isRight()) {
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

export const fromFilteredLeft = () => <L, R>(source: Observable<Either<L, R>>): Observable<L> =>
    new Observable(observer => {
        return source.subscribe({
            next(x) {
                if (x.isLeft()) {
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
