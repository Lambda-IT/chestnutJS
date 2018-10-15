import { Routes } from '@angular/router';
import { ModelPageComponent } from './containers/model-page/model-page.component';
import { ModelDetailPageComponent } from './containers/model-detail-page/model-detail-page.component';
import { CreateModelDetailPageComponent } from './containers/create-model-detail-page/create-model-detail-page.component';
import { AuthGuard } from '@shared/guards/auth-guard';

export const modelRoutes: Routes = [
    {
        path: 'model/:modelName',
        component: ModelPageComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'model/add/:modelName',
        component: CreateModelDetailPageComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'model/:modelName/:id',
        component: ModelDetailPageComponent,
        canActivate: [AuthGuard]
    },
];
