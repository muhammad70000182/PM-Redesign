import { NgModule } from '@angular/core';
import { SharedCustomModule } from '../shared-module/sharedCustom.module';
import { PermissionsSharingService } from '../_services/permissionsharing.service';
import { PermissionsGuard } from '../_Helper/permissions.guard';
import { AdvanceSearchComponent } from './advance-search/advance-search.component';
import { OtherMenuRoutingModule } from './other-menu-routing.module';


@NgModule({
  declarations: [
  AdvanceSearchComponent
    
  ],
  providers:[
    PermissionsSharingService,
    PermissionsGuard
  ],
  imports: [
    
    OtherMenuRoutingModule,
    SharedCustomModule
  ]
})
export class OtherMenuModule {
}
