import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { HttpModule } from '@angular/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';

import { routes } from './app-routes';
import { reducers, metaReducers } from './reducers';
import { CustomRouterStateSerializer } from './shared/utils';
import { CoreModule } from './core/core.module';
import { AppComponent } from './core/containers/app.component';
@NgModule({
    imports: [
        BrowserModule,
        StoreModule.forRoot(reducers, { metaReducers }),
        EffectsModule.forRoot([]),
        RouterModule.forRoot(routes),
        StoreRouterConnectingModule,
        CoreModule.forRoot(),
        HttpModule,
    ],
    providers: [{ provide: RouterStateSerializer, useClass: CustomRouterStateSerializer }],
    bootstrap: [AppComponent],
})
export class AppModule {}
