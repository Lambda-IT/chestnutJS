import { Routes } from '@angular/router';

import { NotFoundPageComponent } from './core/containers/not-found-page.component';

export const routes: Routes = [
    { path: '', redirectTo: '/todos', pathMatch: 'full' },
    { path: 'todos', loadChildren: './todos/todos.module#TodosModule' },
    { path: '**', component: NotFoundPageComponent },
];
