import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from './header/header.component';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { LayoutContainer } from './layout-container/layout-container';

@NgModule({
    imports: [CommonModule, SharedModule, FormsModule],
    declarations: [HeaderComponent, LayoutContainer, LoginDialogComponent],
    exports: [HeaderComponent, LayoutContainer, LoginDialogComponent],
})
export class CoreModule {}
