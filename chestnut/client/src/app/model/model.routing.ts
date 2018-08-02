import { Routes } from '@angular/router';
import { ModelPageComponent } from './containers/model-page/model-page.component';

export const modelRoutes: Routes = [
    {
        path: ':id',
        component: ModelPageComponent,
    }
];
