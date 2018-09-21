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
import { CatalogModule } from './catalog/catalog.module';
import { ModelModule } from './model/model.module';
import { LoginDialogComponent } from '@core/login-dialog/login-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { loginReducer, LoginState } from './login/state/login-reducer';
import { LoginEffects } from './login/state/login-effects';
import { LoginPageComponent } from './login/containers/login-page/login-page.component';

export function logger(reducer: ActionReducer<any>): any {
    return storeLogger()(reducer);
}
const metaReducers = environment.production ? [] : [logger];

export interface State {
    app: AppState;
    login: LoginState;
    router: RouterReducerState;
    apollo: any;
}

export const reducers: ActionReducerMap<State> = {
    app: appReducer,
    login: loginReducer,
    router: routerReducer,
    apollo: apolloReducer,
};

@NgModule({
    declarations: [AppComponent, LoginPageComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ApolloModule,
        HttpLinkModule, // Interceptor !! import from shared
        ReactiveFormsModule,
        FormlyModule.forRoot(),
        FormlyMaterialModule,
        CoreModule,
        SharedModule,
        StaticModule,
        RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules }),
        StoreRouterConnectingModule.forRoot({
            stateKey: 'router', // name of reducer key
        }),
        StoreModule.forRoot(reducers, { metaReducers }),
        NgrxCacheModule,
        EffectsModule.forRoot([AppEffects, LoginEffects]),
        StoreDevtoolsModule.instrument({
            name: 'NgRx Chestnut Store DevTools',
            logOnly: environment.production,
        }),
        CatalogModule,
        ModelModule
    ],
    providers: [],
    bootstrap: [AppComponent],
    entryComponents: [LoginDialogComponent], // https://github.com/angular/material2/issues/1491
})
export class AppModule {
    constructor(apollo: Apollo, httpLink: HttpLink, ngrxCache: NgrxCache, configService: AppConfigService) {
        apollo.create({
            link: httpLink.create({ uri: configService.buildApiUrl('/graphql') }),
            cache: ngrxCache.create({}),
        });
    }
}
