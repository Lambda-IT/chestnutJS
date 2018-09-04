import { Component, Inject, EventEmitter, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';

export interface LoginDialogData {
    username: string;
    password: string;
}

@Component({
    selector: 'app-login-dialog',
    templateUrl: './login-dialog.component.html',
    styleUrls: ['./login-dialog.component.scss'],
})
export class LoginDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<LoginDialogComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            loginDialogData: LoginDialogData;
            loginResult: Observable<any>;
            login: EventEmitter<LoginDialogData>;
        }
    ) {}
}
