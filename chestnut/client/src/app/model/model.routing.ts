import { Routes } from '@angular/router';
import { ModelPageComponent } from './containers/model-page/model-page.component';
import { ModelDetailPageComponent } from './containers/model-detail-page/model-detail-page.component';

export const modelRoutes: Routes = [
    {
        path: 'model/:modelName',
        component: ModelPageComponent,
    },
    {
        path: 'model/:modelName/:id',
        component: ModelDetailPageComponent,
    },
];
