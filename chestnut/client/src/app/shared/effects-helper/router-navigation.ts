import { ActivatedRouteSnapshot } from '@angular/router';
import { Type } from '@angular/core';
import { Option, some, none } from 'fp-ts/lib/Option';

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
