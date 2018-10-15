import { Routes } from '@angular/router';
import { CatalogPageComponent } from './containers/catalog-page/catalog-page.component';
import { AuthGuard } from '@shared/guards/auth-guard';

export const catalogRoutes: Routes = [
    {
        path: 'catalog',
        component: CatalogPageComponent,
        canActivate: [AuthGuard]
    },
];
