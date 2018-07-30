import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from '@shared/shared.module';
import { HomeComponent } from './home/home.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule
    ],
    declarations: [HeaderComponent, HomeComponent],
    exports: [HeaderComponent],
})
export class CoreModule {}
