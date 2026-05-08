import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionsGuard } from '../_Helper/permissions.guard';
import { NewReportComponent } from './new-report/new-report.component';
import { reportlistComponent } from './report-list/report-list';
const routes: Routes = [
  { path: '', component: NewReportComponent, canActivate: [PermissionsGuard], data: { title: 'Reports' } },
  { path: 'new-report', component: NewReportComponent, canActivate: [PermissionsGuard], data: { title: 'Reports' } },
  { path: 'report-list', component: reportlistComponent, canActivate: [PermissionsGuard], data: { title: 'Reports List' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule {
}
