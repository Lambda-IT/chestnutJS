import { Routes } from '@angular/router';
import { HomeComponent } from '@core/home/home.component';
import { LoginPageComponent } from './login/containers/login-page/login-page.component';

export const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
    },
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'login',
        component: LoginPageComponent,
    },
    {
        path: '**',
        redirectTo: 'about',
    },
];
