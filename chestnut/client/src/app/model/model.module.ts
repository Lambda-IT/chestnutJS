import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelPageComponent } from './containers/model-page/model-page.component';
import { RouterModule } from '@angular/router';
import { modelRoutes } from './model.routing';
import { EffectsModule } from '@ngrx/effects';
import { ModelEffects } from './state/model.effect';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { ModeldetailComponent } from './components/modeldetail/modeldetail.component';
import { SharedModule } from '@shared/shared.module';
import { ModellistComponent } from './components/modellist/modellist.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        FormlyModule.forRoot(),
        FormlyMaterialModule,
        RouterModule.forChild(modelRoutes),
        EffectsModule.forFeature([ModelEffects]),
    ],
    declarations: [ModelPageComponent, ModeldetailComponent, ModellistComponent],
})
export class ModelModule {}
