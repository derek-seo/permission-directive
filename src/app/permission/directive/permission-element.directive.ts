import {Directive, OnInit, Optional, SkipSelf, ViewContainerRef,} from '@angular/core';
import {fromEvent} from "rxjs";
import {PermissionService} from "../service/permission.service";

@Directive({
  selector: '[appPermissionElement]',
})
export class PermissionElementDirective implements OnInit {
  constructor(
    private viewContainer: ViewContainerRef,
    @SkipSelf() @Optional()
    private permissionService?: PermissionService,
  ) {
  }

  ngOnInit() {
    fromEvent(this.viewContainer.element.nativeElement, 'click').pipe(
    ).subscribe(($event: any) => {
      if (!this.permissionService) {
        return;
      }

      this.permissionService.submitClickEvent($event);
    })
  }
}
