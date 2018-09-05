import { ReplaySubject, Observable } from 'rxjs';

export const fromInput = <T>(target: T) => <K extends keyof T>(name: K): Observable<T[K]> => {
    const subject = new ReplaySubject<T[K]>(1);

    if (target[name]) {
        subject.next(<any>target[name]);
    }

    Object.defineProperty(target, name, {
        set(value: T[K]): void {
            subject.next(value);
        },
    });

    return subject.asObservable();
};
