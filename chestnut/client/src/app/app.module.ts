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
import { StaticModule } from './static/static.module';
import { NgrxCacheModule, NgrxCache, apolloReducer } from 'apollo-angular-cache-ngrx';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { AppConfigService } from '@shared/services/app-config.service';
import { AppEffects } from './app.effect';
import { AppState, appReducer } from './app.reducer';

export function logger(reducer: ActionReducer<any>): any {
    return storeLogger()(reducer);
}
const metaReducers = environment.production ? [] : [logger];

export interface State {
    app: AppState;
    router: RouterReducerState;
    apollo: any;
}

export const reducers: ActionReducerMap<State> = {
    app: appReducer,
    router: routerReducer,
    apollo: apolloReducer,
};

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ApolloModule,
        HttpLinkModule,
        CoreModule,
        SharedModule,
        StaticModule,
        RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules }),
        StoreRouterConnectingModule.forRoot({
            stateKey: 'router', // name of reducer key
        }),
        StoreModule.forRoot(reducers, { metaReducers }),
        NgrxCacheModule,
        EffectsModule.forRoot([AppEffects]),
        StoreDevtoolsModule.instrument({
            name: 'NgRx Starter Store DevTools',
            logOnly: environment.production,
        }),
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(apollo: Apollo, httpLink: HttpLink, ngrxCache: NgrxCache, configService: AppConfigService) {
        apollo.create({
            link: httpLink.create({ uri: configService.buildApiUrl('/graphql') }),
            cache: ngrxCache.create({}),
        });
    }
}
