import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionsGuard } from '../_Helper/permissions.guard';
import { SAPConnectionSettingsComponent } from './sap-connection-settings/sap-connection-settings.component';
const routes: Routes = [
  {path: '', component: SAPConnectionSettingsComponent,canActivate:[PermissionsGuard], data: { title: 'SAP Connection Setting' }},
  {path: 'sap-connection-setting', component: SAPConnectionSettingsComponent,canActivate:[PermissionsGuard], data: { title: 'SAP Connection Setting' }},
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule {
}
