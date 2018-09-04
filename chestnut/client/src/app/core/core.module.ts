import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from '@shared/shared.module';
import { HomeComponent } from './home/home.component';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, SharedModule, FormsModule],
    declarations: [HeaderComponent, HomeComponent, LoginDialogComponent],
    exports: [HeaderComponent, LoginDialogComponent],
})
export class CoreModule {}
