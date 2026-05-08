import { NgModule } from '@angular/core';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { SharedCustomModule } from '../shared-module/sharedCustom.module';
import { PermissionsSharingService } from '../_services/permissionsharing.service';
import { PermissionsGuard } from '../_Helper/permissions.guard';


@NgModule({
  declarations: [
    UsersComponent,
    RolesComponent,
    
  ],
  providers:[
    PermissionsSharingService,
    PermissionsGuard
  ],
  imports: [
    
    UserManagementRoutingModule,
    SharedCustomModule
  ]
})
export class UserManagementModule {
}
