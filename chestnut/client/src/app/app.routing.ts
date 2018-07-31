import { Routes } from '@angular/router';
import { HomeComponent } from '@core/home/home.component';

export const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'catalog',
        loadChildren: 'app/catalog/catalog.module#CatalogModule'
    },
    {
        path: '**',
        redirectTo: 'about',
    },
];
