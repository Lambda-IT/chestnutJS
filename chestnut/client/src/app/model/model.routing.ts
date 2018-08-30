import { Routes } from '@angular/router';
import { ModelPageComponent } from './containers/model-page/model-page.component';
import { ModelDetailPageComponent } from './containers/model-detail-page/model-detail-page.component';
import { CreateModelDetailPageComponent } from './containers/create-model-detail-page/create-model-detail-page.component';

export const modelRoutes: Routes = [
    {
        path: 'model/:modelName',
        component: ModelPageComponent,
    },
    {
        path: 'model/add/:modelName',
        component: CreateModelDetailPageComponent,
    },
    {
        path: 'model/:modelName/:id',
        component: ModelDetailPageComponent,
    },
];
