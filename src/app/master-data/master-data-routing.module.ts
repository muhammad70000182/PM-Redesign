import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionsGuard } from '../_Helper/permissions.guard';
import { ChecklistComponent } from './checklist/checklist.component';
import { FloorComponent } from './floor/floor.component';
import { FacingComponent } from './facing/facing.component';
import { FacilityComponent } from './facility/facility.component';
import { PropertyStructureComponent } from './property-structure/property-structure.component';
import { PropertyStructureListComponent } from './property-structur-list/property-structur-list.component';
import { unitdetailsComponent } from './unit-details/unit-details.component';
import { SeriesMasterComponent } from './series-master/series-master.component';
import { AdvanceSearchComponent } from '../other-menu/advance-search/advance-search.component';
const routes: Routes = [
  { path: '', component: ChecklistComponent, canActivate: [PermissionsGuard], data: { title: 'CheckList' } },
  { path: 'checklist', component: ChecklistComponent, canActivate: [PermissionsGuard], data: { title: 'CheckList Master' } },
  { path: 'floor', component: FloorComponent, canActivate: [PermissionsGuard], data: { title: 'Floor Master' } },
  { path: 'facing', component: FacingComponent, canActivate: [PermissionsGuard], data: { title: 'Facing Master' } },
  { path: 'facility', component: FacilityComponent, canActivate: [PermissionsGuard], data: { title: 'Facility Master' } },
  { path: 'property-structure', component: PropertyStructureComponent, canActivate: [PermissionsGuard], data: { title: 'Property Structure' } },
  { path: 'property-structure-list', component: PropertyStructureListComponent, canActivate: [PermissionsGuard], data: { title: 'Property Structure Listing' } },
  { path: 'unit-details', component: unitdetailsComponent, canActivate: [PermissionsGuard], data: { title: 'Unit Details' } },
  { path: 'series-master', component: SeriesMasterComponent, canActivate: [PermissionsGuard], data: { title: 'Series Master' } },
  { path: 'advance-search', component: AdvanceSearchComponent, canActivate: [PermissionsGuard], data: { title: 'Advance Search' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterDataRoutingModule {
}
