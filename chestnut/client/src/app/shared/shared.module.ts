import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatButtonModule,
    MatToolbarModule,
    MatTooltipModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MatSidenavModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatCheckboxModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDialogModule,
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { NgxFpTsModule } from 'ngx-fp-ts';
import { AuthGuard } from '@shared/guards/auth-guard';
import { StoreModule } from '@ngrx/store';
import { sharedStateReducer } from '@shared/state/reducers';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '@shared/interceptor/auth-interceptor';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormlyTinyMCEComponent } from '@shared/formly/tinymce.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';

@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        MatToolbarModule,
        MatTooltipModule,
        MatIconModule,
        MatMenuModule,
        MatListModule,
        MatSidenavModule,
        MatSelectModule,
        MatTableModule,
        MatSortModule,
        MatInputModule,
        MatCheckboxModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        RouterModule,
        NgxFpTsModule,
        EditorModule,
        ReactiveFormsModule,
        FormlyModule.forChild({
            types: [
              { name: 'html', component: FormlyTinyMCEComponent },
            ]
        }),
        FormlyMaterialModule,
        StoreModule.forFeature('shared', sharedStateReducer),
    ],
    exports: [
        CommonModule,
        MatButtonModule,
        MatToolbarModule,
        MatTooltipModule,
        MatIconModule,
        MatMenuModule,
        MatListModule,
        MatSidenavModule,
        MatSelectModule,
        MatTableModule,
        MatSortModule,
        MatInputModule,
        MatCheckboxModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        RouterModule,
        NgxFpTsModule,
        EditorModule,
        ReactiveFormsModule,
        FormlyMaterialModule
    ],
    providers: [AuthGuard, {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true,
    }],
    declarations: [FormlyTinyMCEComponent],
})
export class SharedModule {}
