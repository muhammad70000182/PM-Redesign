import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionsGuard } from '../_Helper/permissions.guard';
import { StageMasterComponent } from './stage-master/stage-master.component';
import { ApprovalHierarchyComponent } from './approval-hierarchy/approval-hierarchy.component';
import { PendingAgreementListingComponent } from './pending-agreement-listing/pending-agreement-listing.component';
const routes: Routes = [
  { path: '', component: StageMasterComponent, canActivate: [PermissionsGuard], data: { title: 'Stage Master' } },
  { path: 'stage-master', component: StageMasterComponent, canActivate: [PermissionsGuard], data: { title: 'Stage Master' } },
  { path: 'approval-hierarchy', component: ApprovalHierarchyComponent, canActivate: [PermissionsGuard], data: { title: 'Approval Hierarchy' } },
  { path: 'pending-documents', component: PendingAgreementListingComponent, canActivate: [PermissionsGuard], data: { title: 'Pending Agreement' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovalManagementRoutingModule {
}
