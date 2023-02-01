import {Component} from '@angular/core';
import {Option, Permission} from "./permission/directive/permission.directive";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  option: Option = {
    isDisplay: true,
    currentPermission: Permission.MASTER,
    requiredPermission: Permission.MASTER,
  };

  ngOnInit(): void {
    setTimeout(() => {
      this.option = {...this.option, currentPermission: Permission.USER};
    }, 3000);

    setTimeout(() => {
      this.option = {...this.option, currentPermission: Permission.MASTER};
    }, 6000);

    setTimeout(() => {
      this.option = {...this.option, currentPermission: Permission.USER};
    }, 9000);
  }

  onClick($event: Event): void {
    console.log('click event');
  }

  onPermissionError(error: any): void {
    console.log(error);
  }
}
