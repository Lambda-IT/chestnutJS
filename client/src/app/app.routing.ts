import { Routes } from '@angular/router';
import { LoginPageComponent } from './login/containers/login-page/login-page.component';

export const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/catalog',
        pathMatch: 'full',
    },
    {
        path: 'login',
        component: LoginPageComponent,
    },
    {
        path: '**',
        redirectTo: '/catalog',
    },
];
