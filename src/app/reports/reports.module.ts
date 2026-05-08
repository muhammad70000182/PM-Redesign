import { NgModule } from '@angular/core';
import { SharedCustomModule } from '../shared-module/sharedCustom.module';
import { PermissionsSharingService } from '../_services/permissionsharing.service';
import { PermissionsGuard } from '../_Helper/permissions.guard';
import { ReportsRoutingModule } from './reports-routing.module';
import { NewReportComponent } from './new-report/new-report.component';
import { reportlistComponent } from './report-list/report-list';


@NgModule({
  declarations: [
  NewReportComponent,
  reportlistComponent
  ],
  providers:[
    PermissionsSharingService,
    PermissionsGuard
  ],
  imports: [
    ReportsRoutingModule,
    SharedCustomModule
  ]
})
export class ReportsModule {
}
