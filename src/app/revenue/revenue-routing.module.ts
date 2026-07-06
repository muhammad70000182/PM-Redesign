import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionsGuard } from '../_Helper/permissions.guard';
import { RevenuePopulationComponent } from './revenue-population/revenue-population.component';
import { RevenuePostingComponent } from './revenue-posting/revenue-posting.component';
import { RevenuePostingListComponent } from './revenue-posting-list/revenue-posting-list.component';
const routes: Routes = [
  //{ path: '', component: RevenuePopulationComponent, canActivate: [PermissionsGuard], data: { title: 'Revenue Population Off Plan' } },
  //{ path: 'revenue-population', component: RevenuePopulationComponent, canActivate: [PermissionsGuard], data: { title: 'Revenue Population Off Plan' } },
  { path: 'revenue-posting', component: RevenuePostingComponent, canActivate: [PermissionsGuard], data: { title: 'Revenue Posting' } },
  //{ path: 'revenue-posting-list', component: RevenuePostingListComponent, canActivate: [PermissionsGuard], data: { title: 'Revenue Posting List' } },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RevenueRoutingModule {
}
