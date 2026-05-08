import { NgModule } from '@angular/core';
import { SharedCustomModule } from '../shared-module/sharedCustom.module';
import { PermissionsSharingService } from '../_services/permissionsharing.service';
import { PermissionsGuard } from '../_Helper/permissions.guard';
import { AdministrationRoutingModule } from './administration-routing.module';
import { SAPConnectionSettingsComponent } from './sap-connection-settings/sap-connection-settings.component';


@NgModule({
  declarations: [
  SAPConnectionSettingsComponent
    
  ],
  providers:[
    PermissionsSharingService,
    PermissionsGuard
  ],
  imports: [
    
    AdministrationRoutingModule,
    SharedCustomModule
  ]
})
export class AdministrationModule {
}
