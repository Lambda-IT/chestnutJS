import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './containers/login-page/login-page.component';
import { RouterModule } from '@angular/router';
import { loginRoutes } from './login.routing';
import { SharedModule } from '@shared/shared.module';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { LoginEffects } from './state/login-effects';
import { StoreModule } from '@ngrx/store';
import { loginReducer } from './state/login-reducer';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        FormlyModule.forRoot(),
        FormlyMaterialModule,
        RouterModule.forChild(loginRoutes),
        EffectsModule.forFeature([LoginEffects]),
        StoreModule.forFeature('login', loginReducer),
    ],
    declarations: [LoginPageComponent],
})
export class LoginModule {}
