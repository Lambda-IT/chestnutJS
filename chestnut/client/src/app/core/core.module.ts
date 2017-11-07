import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducers } from '../reducers';
import { ModelsEffects } from '../models/effects/models.effects';
import { AppComponent } from './containers/app.component';
import { NotFoundPageComponent } from './containers/not-found-page.component';
import { ModelsListComponent } from '../models/components/models-list/models-list.component';
import { ModelCollectionPageComponent } from '../models/containers/models-collection/models-collection-page.component';
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([{ path: '', component: ModelCollectionPageComponent }]),
        StoreModule.forFeature('todos', reducers),
        EffectsModule.forFeature([ModelsEffects]),
    ],
    exports: [AppComponent, NotFoundPageComponent],
    declarations: [AppComponent, NotFoundPageComponent, ModelCollectionPageComponent, ModelsListComponent],
})
export class CoreModule {
    static forRoot() {
        return { ngModule: CoreModule };
    }
}
