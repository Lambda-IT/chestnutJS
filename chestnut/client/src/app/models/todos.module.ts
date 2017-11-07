import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducers } from './reducers';
import { TodosEffects } from './effects/todos.effects';

import { TodosCollectionPageComponent } from './containers/todos-collection/todos-collection-page.component';

import { TodosListComponent } from './components/todos-list';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([{ path: '', component: TodosCollectionPageComponent }]),
        StoreModule.forFeature('todos', reducers),
        EffectsModule.forFeature([TodosEffects]),
    ],
    declarations: [TodosListComponent, TodosCollectionPageComponent],
})
export class TodosModule {}
