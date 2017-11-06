import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AppComponent } from './containers/app.component';
import { NotFoundPageComponent } from './containers/not-found-page.component';

@NgModule({
    imports: [CommonModule, RouterModule],
    exports: [AppComponent, NotFoundPageComponent],
    declarations: [AppComponent, NotFoundPageComponent],
})
export class CoreModule {
    static forRoot() {
        return { ngModule: CoreModule };
    }
}
