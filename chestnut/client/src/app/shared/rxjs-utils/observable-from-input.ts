import { ReplaySubject, Observable } from 'rxjs';

export function fromInput<T, R>(target: T, name: keyof T): Observable<R> {
    const subject = new ReplaySubject<R>(1);

    if (target[name]) {
        subject.next(<any>target[name]);
    }

    Object.defineProperty(target, name, {
        set(value: R): void {
            subject.next(value);
        },
    });

    return subject.asObservable();
}
