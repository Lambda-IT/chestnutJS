import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelPageComponent } from './containers/model-page/model-page.component';
import { RouterModule } from '@angular/router';
import { modelRoutes } from './model.routing';
import { EffectsModule } from '@ngrx/effects';
import { ModelEffects } from './state/model.effect';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(modelRoutes),
        EffectsModule.forFeature([ModelEffects])],
    declarations: [ModelPageComponent],
})
export class ModelModule { }
