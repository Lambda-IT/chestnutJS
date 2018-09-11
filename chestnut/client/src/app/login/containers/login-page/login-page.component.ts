import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { tap, takeUntil } from 'rxjs/operators';
import { FormGroup, Validators } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Store } from '@ngrx/store';
import { Login } from '../../state/login-reducer';

export interface LoginDataModel {
    username: string;
    password: string;
}

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnDestroy {
    private destroying$ = new EventEmitter();
    model: LoginDataModel = { username: '', password: '' };
    form = new FormGroup({});
    fields = <FormlyFieldConfig>[
        {
            fieldGroup: [
                {
                    key: 'username',
                    type: 'input',
                    templateOptions: {
                        type: 'email',
                        label: 'Username',
                        placeholder: 'Enter username',
                    },
                    validators: {
                        validation: Validators.compose([Validators.required]),
                    },
                },
                {
                    key: 'password',
                    type: 'input',
                    templateOptions: {
                        type: 'password',
                        label: 'Password',
                        placeholder: 'Password',
                        // pattern: '^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[dW]).{8,}$',
                    },
                    validators: {
                        validation: Validators.compose([Validators.required]),
                    },
                },
            ],
        },
    ];

    submit$ = new EventEmitter<LoginDataModel>();

    constructor(private store: Store<any>) {
        this.submit$
            .pipe(
                tap(x => alert(JSON.stringify(x))),
                takeUntil(this.destroying$)
            )
            .subscribe(x => this.store.dispatch(new Login(x)));
    }

    ngOnDestroy(): void {
        this.destroying$.emit();
    }
}
