import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

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
        public dialogRef: MatDialogRef<LoginDialogComponent, LoginDialogData>,
        @Inject(MAT_DIALOG_DATA) public data: LoginDialogData
    ) {}
}
