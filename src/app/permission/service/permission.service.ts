import {Injectable, OnDestroy} from "@angular/core";
import {Subject} from "rxjs";

@Injectable()
export class PermissionService implements OnDestroy {
  private readonly clickEvent$ = new Subject<Event>();

  ngOnDestroy() {
    this.clickEvent$.complete();
  }

  submitClickEvent(event: Event) {
    this.clickEvent$.next(event);
  }

  getClickEvent$(): Subject<Event> {
    return this.clickEvent$;
  }

  destroy$(): void {
    this.clickEvent$.complete();
  }
}
