import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionDirective } from './directive/permission.directive';

@NgModule({
  declarations: [PermissionDirective],
  exports: [PermissionDirective],
})
export class PermissionModule {}
