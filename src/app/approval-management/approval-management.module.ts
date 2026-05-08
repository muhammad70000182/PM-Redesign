import { NgModule } from '@angular/core';
import { SharedCustomModule } from '../shared-module/sharedCustom.module';
import { PermissionsSharingService } from '../_services/permissionsharing.service';
import { PermissionsGuard } from '../_Helper/permissions.guard';
import { ApprovalManagementRoutingModule } from './approval-management-routing.module';
import { StageMasterComponent } from './stage-master/stage-master.component';
import { ApprovalHierarchyComponent } from './approval-hierarchy/approval-hierarchy.component';
import { PendingAgreementListingComponent } from './pending-agreement-listing/pending-agreement-listing.component';

@NgModule({
  declarations: [
  StageMasterComponent,
    ApprovalHierarchyComponent,
    PendingAgreementListingComponent
  ],
  providers:[
    PermissionsSharingService,
    PermissionsGuard
  ],
  imports: [
    ApprovalManagementRoutingModule,
    SharedCustomModule
  ]
})
export class ApprovalManagmentModule {
}
