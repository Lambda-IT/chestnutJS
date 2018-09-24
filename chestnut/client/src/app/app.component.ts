import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ErrorType } from '@shared/bind-functions';
import { Option } from 'fp-ts/lib/Option';
import { Observable } from 'rxjs';
import { appSelectors } from './app.reducer';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
    private destroying$ = new EventEmitter();
    title = 'client';
    loginClicked$ = new EventEmitter();

    error$: Observable<Option<ErrorType>>;

    constructor(private store: Store<any>) {
        // , public dialog: MatDialog) {
        this.error$ = this.store.select(appSelectors.error);

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
