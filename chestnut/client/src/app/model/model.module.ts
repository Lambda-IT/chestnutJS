import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelPageComponent } from './containers/model-page/model-page.component';
import { RouterModule } from '@angular/router';
import { modelRoutes } from './model.routing';
import { EffectsModule } from '@ngrx/effects';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { ModeldetailComponent } from './components/modeldetail/modeldetail.component';
import { SharedModule } from '@shared/shared.module';
import { ModellistComponent } from './components/modellist/modellist.component';
import { ModelDetailPageComponent } from './containers/model-detail-page/model-detail-page.component';
import { StoreModule } from '@ngrx/store';
import { modelReducer } from './state/model.reducer';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        FormlyModule.forRoot(),
        FormlyMaterialModule,
        RouterModule.forChild(modelRoutes),
        StoreModule.forFeature('model', modelReducer),
        EffectsModule.forFeature([]),
    ],
    declarations: [ModelPageComponent, ModeldetailComponent, ModellistComponent, ModelDetailPageComponent],
})
export class ModelModule {}
