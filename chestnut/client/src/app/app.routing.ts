import { Routes } from '@angular/router';
import { HomeComponent } from '@core/home/home.component';
import { catalogRoutes } from './catalog/catalog.routing';
import { modelRoutes } from './model/model.routing';

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
        path: 'catalog',
        children: catalogRoutes,
        // loadChildren: 'app/catalog/catalog.module#CatalogModule',
    },
    {
        path: 'model',
        // loadChildren: 'app/model/model.module#ModelModule',
        children: modelRoutes,
    },
    {
        path: '**',
        redirectTo: 'about',
    },
];
