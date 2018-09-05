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
    MatProgressSpinnerModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { NgxFpTsModule } from 'ngx-fp-ts';

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
        RouterModule,
        NgxFpTsModule
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
      RouterModule,
      NgxFpTsModule],
    declarations: [],
})
export class SharedModule {}
