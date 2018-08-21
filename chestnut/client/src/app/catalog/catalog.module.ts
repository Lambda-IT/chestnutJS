import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogPageComponent } from './containers/catalog-page/catalog-page.component';
import { catalogRoutes } from './catalog.routing';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '@shared/shared.module';
import { catalogReducer } from './state/catalog.reducer';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(catalogRoutes),
        EffectsModule.forFeature([]),
        StoreModule.forFeature('catalog', catalogReducer),
    ],
    declarations: [CatalogPageComponent],
})
export class CatalogModule {}
