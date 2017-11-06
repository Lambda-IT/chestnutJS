import { Routes } from '@angular/router';

import { NotFoundPageComponent } from './core/containers/not-found-page.component';
import { ModelCollectionPageComponent } from './models/containers/models-collection/models-collection-page.component';
export const routes: Routes = [
    // { path: '', redirectTo: '/todos', pathMatch: 'full' },
    { path: 'chestnut', component: ModelCollectionPageComponent },
    { path: '**', component: NotFoundPageComponent },
];
