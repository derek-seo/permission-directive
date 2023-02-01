import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {PermissionModule} from "./permission/permission.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    PermissionModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
