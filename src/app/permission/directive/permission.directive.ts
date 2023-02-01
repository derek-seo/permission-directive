import {
  Directive,
  EventEmitter,
  Host,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import {Subject, Subscription, takeUntil} from 'rxjs';
import {filter} from 'rxjs/operators';
import {PermissionService} from "../service/permission.service";

export enum Permission {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MASTER = 'MASTER',
}

const PERMISSION_VALUE: Record<Permission, number> = {
  [Permission.USER]: 0,
  [Permission.ADMIN]: 1,
  [Permission.MASTER]: 2,
};

export interface Option {
  isDisplay: boolean;
  currentPermission: Permission;
  requiredPermission: Permission;
}

@Directive({
  selector: '[appPermission]',
  providers: [PermissionService],
})
export class PermissionDirective implements OnInit, OnDestroy {
  private readonly _destroy$ = new Subject<void>();

  private internalOption: Option = {
    currentPermission: Permission.USER,
    requiredPermission: Permission.USER,
    isDisplay: true,
  };

  private hasView = false;

  clickSubscription: Subscription = new Subscription();

  @Input() set appPermission(option: Option) {
    this.internalOption = {...option};
    const {currentPermission, requiredPermission}: Option = option;
    const isValidPermission = this.isValidPermission({
      requiredPermission,
      currentPermission,
    });

    this.permissionEffect({isValidPermission, option});
  }

  @Output() permissionClick = new EventEmitter<Event>();
  @Output() permissionError = new EventEmitter<{
    currentPermission: Permission;
    requiredPermission: Permission;
  }>();

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    @Host()
    private permissionService: PermissionService
  ) {
  }

  ngOnInit(): void {
  }

  unSubscribeClickEvent(): void {
    if (this.clickSubscription) {
      this.clickSubscription.unsubscribe();
    }
  }

  subscribeClickEvent(): void {
    if (this.clickSubscription) {
      this.clickSubscription.unsubscribe();
    }

    this.clickSubscription = this.permissionService.getClickEvent$()
      .pipe(
        filter(() => {
          const {currentPermission, requiredPermission}: Option =
            this.internalOption;
          const isValidPermission = this.isValidPermission({
            requiredPermission,
            currentPermission,
          });

          this.permissionEffect({
            isValidPermission,
            option: this.internalOption,
          });

          return isValidPermission;
        }),
        takeUntil(this._destroy$)
      )
      .subscribe({
        next: ($event: Event) => {
          this.permissionClick.emit($event);
        },
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private isValidPermission({requiredPermission, currentPermission}: {
    requiredPermission: Permission;
    currentPermission: Permission;
  }): boolean {
    const currentPermissionValue = PERMISSION_VALUE[currentPermission];
    const requiredPermissionValue = PERMISSION_VALUE[requiredPermission];

    return requiredPermissionValue <= currentPermissionValue;
  }

  private permissionEffect({option: {currentPermission, requiredPermission, isDisplay}, isValidPermission}: {
    option: Option;
    isValidPermission: boolean;
  }): void {
    // 권한에러 이벤트 발생시킴
    this.permissionErrorEffect({
      isValidPermission,
      currentPermission,
      requiredPermission,
    });
    // 권한에러에 따라 디스플레이 처리
    this.displayEffectByPermission({isValidPermission, isDisplay});
  }

  private displayEffectByPermission({isValidPermission, isDisplay}: {
    isDisplay: boolean;
    isValidPermission: boolean;
  }) {
    if (!this.hasView && (isValidPermission || isDisplay)) {
      this.hasView = true;
      this.viewContainer.createEmbeddedView(
        this.templateRef
      );

      this.subscribeClickEvent();
    } else if (this.hasView && !isValidPermission && !isDisplay) {
      this.viewContainer.clear();
      this.hasView = false;

      this.unSubscribeClickEvent();
    }
  }

  private permissionErrorEffect({isValidPermission, currentPermission, requiredPermission}: {
    isValidPermission: boolean;
    currentPermission: Permission;
    requiredPermission: Permission;
  }): void {
    if (!isValidPermission) {
      this.permissionError.emit({
        requiredPermission,
        currentPermission,
      });
    }
  }
}
