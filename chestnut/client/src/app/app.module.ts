import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { CoreModule } from '@core/core.module';
import { AppComponent } from './app.component';
import { SharedModule } from '@shared/shared.module';
import { appRoutes } from './app.routing';
import { StoreRouterConnectingModule, routerReducer, RouterReducerState } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'environments/environment';
import { ActionReducerMap, StoreModule, ActionReducer } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import { storeLogger } from 'ngrx-store-logger';


export function logger(reducer: ActionReducer<any>): any {
    return storeLogger()(reducer);
}
const metaReducers = environment.production ? [] : [logger];

export interface State {
    // app: AppState;
    router: RouterReducerState;
  }

export const reducers: ActionReducerMap<State> = {
    // app: appReducer,
    router: routerReducer
};


@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        CoreModule,
        SharedModule,
        RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules }),
        StoreRouterConnectingModule.forRoot({
            stateKey: 'router' // name of reducer key
        }),
        StoreModule.forRoot(reducers, { metaReducers }),
        EffectsModule.forRoot([]),
        StoreDevtoolsModule.instrument({
            name: 'NgRx Starter Store DevTools',
            logOnly: environment.production,
        }),
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
