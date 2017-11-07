import { Routes } from '@angular/router';

import { NotFoundPageComponent } from './core/containers/not-found-page.component';
import { ModelCollectionPageComponent } from './models/containers/models-collection/models-collection-page.component';
import { ModelviewPageComponent } from './models/containers/model-view/model-view-page.component';
export const routes: Routes = [
    { path: 'chestnut', component: ModelCollectionPageComponent },
    { path: 'modelview/:model', component: ModelviewPageComponent },
    { path: '**', component: NotFoundPageComponent },
];
