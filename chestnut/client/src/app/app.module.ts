import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { CoreModule } from '@core/core.module';
import { AppComponent } from './app.component';
import { SharedModule } from '@shared/shared.module';
import { appRoutes } from './app.routing';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CoreModule,
        SharedModule,
        RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules }),
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
