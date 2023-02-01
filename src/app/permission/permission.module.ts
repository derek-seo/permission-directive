import {NgModule} from '@angular/core';
import {PermissionDirective} from './directive/permission.directive';
import {PermissionElementDirective} from "./directive/permission-element.directive";

@NgModule({
  declarations: [PermissionDirective, PermissionElementDirective],
  exports: [PermissionDirective, PermissionElementDirective],
})
export class PermissionModule {
}
