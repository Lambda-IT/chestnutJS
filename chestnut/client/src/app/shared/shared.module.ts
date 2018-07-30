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
    MatCardModule
} from '@angular/material';
import { RouterModule } from '@angular/router';

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
        RouterModule
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
      RouterModule],
    declarations: [],
})
export class SharedModule {}
