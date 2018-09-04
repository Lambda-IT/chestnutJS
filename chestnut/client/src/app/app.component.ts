import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ErrorType } from '@shared/bind-functions';
import { Option } from 'fp-ts/lib/Option';
import { Observable, of } from 'rxjs';
import { modelSelectors, Login } from './app.reducer';
import { tap, takeUntil, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { LoginDialogComponent, LoginDialogData } from '@core/login-dialog/login-dialog.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
    title = 'client';

    loginClicked$ = new EventEmitter();
    destroying$ = new EventEmitter();

    error$: Observable<Option<ErrorType>>;

    constructor(private store: Store<any>, public dialog: MatDialog) {
        this.error$ = this.store.select(modelSelectors.error);

        const onLogin$ = new EventEmitter<LoginDialogData>();
        const loginResult$ = of({ error: '  Ohhh neiiin' });

        this.loginClicked$
            .pipe(
                tap(x => console.log('------loginClicked------', x)),
                map(_ =>
                    this.dialog.open(LoginDialogComponent, {
                        width: '400px',
                        data: {
                            loginDialogData: { username: '', password: '' },
                            loginResult: loginResult$,
                            login: onLogin$,
                        },
                    })
                ),
                takeUntil(this.destroying$)
            )
            .subscribe();

        onLogin$
            .pipe(
                tap(x => alert('ydfkndskhg')),
                takeUntil(this.destroying$)
            )
            .subscribe(x => this.store.dispatch(new Login(x)));
    }

    ngOnDestroy(): void {
        this.destroying$.emit();
    }
}
