import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatButtonModule,
    MatToolbarModule,
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

@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        MatToolbarModule,
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
        StoreModule.forFeature('shared', sharedStateReducer),
    ],
    exports: [
        CommonModule,
        MatButtonModule,
        MatToolbarModule,
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
        NgxFpTsModule
    ],
    providers: [AuthGuard],
    declarations: [],
})
export class SharedModule {}
