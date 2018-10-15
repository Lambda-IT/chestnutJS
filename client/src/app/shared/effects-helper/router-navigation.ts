import { ActivatedRouteSnapshot } from '@angular/router';
import { Type } from '@angular/core';
import { Option, some, none } from 'fp-ts/lib/Option';
import { Observable, Observer } from 'rxjs';

export function findSnapshot(component: Type<any>, s: ActivatedRouteSnapshot): Option<ActivatedRouteSnapshot> {
    if (s.routeConfig && s.routeConfig.component === component) {
        return some(s);
    }
    for (const c of s.children) {
        const ss = findSnapshot(component, c);
        if (ss) {
            return ss;
        }
    }
    return none;
}

export const fromFilteredSome = () => <T>(source: Observable<Option<T>>): Observable<T> =>
    Observable.create((observer: Observer<T>) => {
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
