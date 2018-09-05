import { Routes } from '@angular/router';
import { LoginPageComponent } from './containers/login-page/login-page.component';

export const loginRoutes: Routes = [
    {
        path: 'login',
        component: LoginPageComponent,
    },
];
