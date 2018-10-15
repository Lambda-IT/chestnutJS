import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ErrorType } from '@shared/bind-functions';
import { Option } from 'fp-ts/lib/Option';
import { Observable } from 'rxjs';
import { appSelectors } from './app.reducer';
import { loginSelectors } from './login/state/login-reducer';
import { HeaderModel } from './login/login.model';
import { tap, takeUntil, map } from 'rxjs/operators';
import { LogoutAction } from '@shared/state/actions';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
    private destroying$ = new EventEmitter();
    title = 'client';
    logoutClicked$ = new EventEmitter();

    error$: Observable<Option<ErrorType>>;
    headerModel$: Observable<HeaderModel>;

    constructor(private store: Store<any>) {
        // , public dialog: MatDialog) {
        this.error$ = this.store.select(appSelectors.error);
        this.headerModel$ = this.store.select(loginSelectors.headerModel);

        this.logoutClicked$.pipe(
            tap(x => console.log('------logouztClicked------', x)),
            map(_ => this.store.dispatch(new LogoutAction())),
            takeUntil(this.destroying$)
        ).subscribe();

        // const onLogin$ = new EventEmitter<LoginDialogData>();
        // const loginResult$ = of({ error: '  Ohhh neiiin' });

        // this.loginClicked$
        //     .pipe(
        //         tap(x => console.log('------loginClicked------', x)),
        //         map(_ =>
        //             this.dialog.open(LoginDialogComponent, {
        //                 width: '400px',
        //                 data: {
        //                     loginDialogData: { username: '', password: '' },
        //                     loginResult: loginResult$,
        //                     login: onLogin$,
        //                 },
        //             })
        //         ),
        //         takeUntil(this.destroying$)
        //     )
        //     .subscribe();

        // onLogin$.pipe(takeUntil(this.destroying$)).subscribe(x => this.store.dispatch(new Login(x)));
    }

    ngOnDestroy(): void {
        this.destroying$.emit();
    }
}
