import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TwoButtonModalComponent } from './Pages/two-button-modal/two-button-modal.component';
import { OneButtonModalComponent } from './Pages/one-button-modal/one-button-modal.component';


@NgModule({
  declarations: [
    AppComponent,
    TwoButtonModalComponent,
    OneButtonModalComponent
  ],
  imports: [
    BrowserModule, HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
