import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { sharedStateSelectors } from '../state/reducers';
import { map } from 'rxjs/operators';
import { fromFilteredSome } from '@core/rx-helpers';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private store: Store<any>) {}

    canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.store.select(sharedStateSelectors.isLoggedIn).pipe(
            fromFilteredSome(),
            map(loggedIn => {
                if (loggedIn) {
                    return true;
                }
                this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                return false;
            })
        );
    }
}
