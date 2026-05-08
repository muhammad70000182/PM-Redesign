import { NgModule } from '@angular/core';
import { PermissionsRoutingModule } from './permissions-routing.module';
import { ParentPermissionsComponent } from './parent-permissions/parent-permissions.component';
import {PermissionsComponent} from './permissions/permissions.component'
import {AssignPermissionsComponent} from './assign-permissions/assign-permissions.component'
import { SharedCustomModule } from '../shared-module/sharedCustom.module';
import { PermissionsSharingService } from '../_services/permissionsharing.service';
import { PermissionsGuard } from '../_Helper/permissions.guard';
@NgModule({
  declarations: [
    ParentPermissionsComponent,
    PermissionsComponent,
    AssignPermissionsComponent
  ],
  providers:[
    PermissionsSharingService,
    PermissionsGuard
  ],
  imports: [
    PermissionsRoutingModule,
    SharedCustomModule
  ]
})
export class PermissionsModule {
}
