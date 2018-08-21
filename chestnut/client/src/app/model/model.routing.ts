import { Routes } from '@angular/router';
import { ModelPageComponent } from './containers/model-page/model-page.component';

export const modelRoutes: Routes = [
    {
        path: 'model/:modelName',
        component: ModelPageComponent,
    },
    {
        path: 'model/:modelName/:id',
        component: ModelPageComponent,
    },
];
