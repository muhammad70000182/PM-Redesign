import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionsGuard } from '../_Helper/permissions.guard';
import { AdvanceSearchComponent } from './advance-search/advance-search.component';
const routes: Routes = [
  {path: '', component: AdvanceSearchComponent,canActivate:[PermissionsGuard], data: { title: 'SAP Connection Setting' }},
 // {path: 'advance-search', component: AdvanceSearchComponent,canActivate:[PermissionsGuard], data: { title: 'Advance Search' }},
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtherMenuRoutingModule {
}
