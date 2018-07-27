import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatToolbarModule, MatIconModule, MatMenuModule, MatListModule,
  MatSidenavModule, MatSelectModule, MatTableModule, MatSortModule, MatInputModule,
  MatCheckboxModule,
} from '@angular/material';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, NoopAnimationsModule,
    MatButtonModule, MatToolbarModule, MatIconModule, MatMenuModule, MatListModule,
    MatSidenavModule, MatSelectModule, MatTableModule, MatSortModule, MatInputModule,
    MatCheckboxModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
