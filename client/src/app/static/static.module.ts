import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about/about.component';
import { staticRoutes } from './static.routing';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [CommonModule, RouterModule.forChild(staticRoutes)],
    declarations: [AboutComponent],
})
export class StaticModule {}
