import { ReplaySubject, Observable } from 'rxjs';

export function fromInput<T>(target: object, name: string): Observable<T> {
    const subject = new ReplaySubject<T>(1);

    if (target[name]) {
        subject.next(target[name]);
    }

    Object.defineProperty(target, name, {
        set(value: T): void {
            subject.next(value);
        },
    });

    return subject.asObservable();
}
