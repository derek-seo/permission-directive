import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {PermissionModule} from "./permission/permission.module";
import {App2Component} from "./app2/app2.component";

@NgModule({
  declarations: [
    AppComponent,
    App2Component,
  ],
  imports: [
    BrowserModule,
    PermissionModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
