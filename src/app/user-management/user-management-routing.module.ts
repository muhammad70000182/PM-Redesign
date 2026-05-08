import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { PermissionsGuard } from '../_Helper/permissions.guard';
const routes: Routes = [
  {path: '', component: UsersComponent,canActivate:[PermissionsGuard], data: { title: 'users'}},
  {path: 'users', component: UsersComponent,canActivate:[PermissionsGuard], data: { title: 'users'}},
  {path: 'roles', component: RolesComponent,canActivate:[PermissionsGuard], data: { title: 'Roles'}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule {
}
