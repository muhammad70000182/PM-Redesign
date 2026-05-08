import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParentPermissionsComponent } from './parent-permissions/parent-permissions.component';
import { PermissionsComponent } from './permissions/permissions.component';
import {AssignPermissionsComponent} from './assign-permissions/assign-permissions.component'
import { PermissionsGuard } from '../_Helper/permissions.guard';
const routes: Routes = [
  {path: '', component: ParentPermissionsComponent,canActivate:[PermissionsGuard], data: { title: 'Parent Permissions'}},
  {path: 'parent-permissions', component: ParentPermissionsComponent,canActivate:[PermissionsGuard], data: { title: 'Parent Permissions'}},
  {path: 'permissions', component: PermissionsComponent,canActivate:[PermissionsGuard], data: { title: 'Parent Permissions'}},
  {path: 'assign-permissions', component: AssignPermissionsComponent,canActivate:[PermissionsGuard], data: { title: 'Assign Permissions'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionsRoutingModule {
}
