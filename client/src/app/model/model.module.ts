import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelPageComponent } from './containers/model-page/model-page.component';
import { RouterModule } from '@angular/router';
import { modelRoutes } from './model.routing';
import { EffectsModule } from '@ngrx/effects';
import { FormlyModule } from '@ngx-formly/core';
import { ModeldetailComponent } from './components/modeldetail/modeldetail.component';
import { SharedModule } from '@shared/shared.module';
import { ModellistComponent } from './components/modellist/modellist.component';
import { ModelDetailPageComponent } from './containers/model-detail-page/model-detail-page.component';
import { StoreModule } from '@ngrx/store';
import { modelReducer } from './state/model.reducer';
import { CreateModelDetailPageComponent } from './containers/create-model-detail-page/create-model-detail-page.component';
import { ModelEffects } from './state/model.effects';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        FormlyModule.forChild(),
        RouterModule.forChild(modelRoutes),
        StoreModule.forFeature('model', modelReducer),
        EffectsModule.forFeature([ModelEffects]),
    ],
    declarations: [
        ModelPageComponent,
        ModeldetailComponent,
        ModellistComponent,
        ModelDetailPageComponent,
        CreateModelDetailPageComponent,
    ],
})
export class ModelModule {}
