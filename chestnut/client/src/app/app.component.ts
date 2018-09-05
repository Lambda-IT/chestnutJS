import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ErrorType } from '@shared/bind-functions';
import { Option } from 'fp-ts/lib/Option';
import { Observable } from 'rxjs';
import { modelSelectors } from './app.reducer';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'client';

    error$: Observable<Option<ErrorType>>;

    constructor(private store: Store<any>) {
        this.error$ = this.store.select(modelSelectors.error);
    }
}
