import { NgModule } from '@angular/core';
import { MasterDataRoutingModule } from './master-data-routing.module';


import { SharedCustomModule } from '../shared-module/sharedCustom.module';
import { PermissionsSharingService } from '../_services/permissionsharing.service';
import { PermissionsGuard } from '../_Helper/permissions.guard';
import { ChecklistComponent } from './checklist/checklist.component';
import { FloorComponent } from './floor/floor.component';
import { FacingComponent } from './facing/facing.component';
import { FacilityComponent } from './facility/facility.component';
import { PropertyStructureComponent } from './property-structure/property-structure.component';
import { PropertyStructureListComponent } from './property-structur-list/property-structur-list.component';
import { unitdetailsComponent } from './unit-details/unit-details.component';
import { SeriesMasterComponent } from './series-master/series-master.component';


@NgModule({
  declarations: [
    ChecklistComponent,
    FloorComponent,
    FacingComponent,
    FacilityComponent,
    PropertyStructureComponent,
    PropertyStructureListComponent,
    unitdetailsComponent,
    SeriesMasterComponent
  ],
  providers: [
    PermissionsSharingService,
    PermissionsGuard
  ],
  imports: [

    MasterDataRoutingModule,
    SharedCustomModule
  ]
})
export class MasterDataModule {
}
