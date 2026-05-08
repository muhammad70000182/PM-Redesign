import { NgModule } from '@angular/core';
import { SharedCustomModule } from '../shared-module/sharedCustom.module';
import { PermissionsSharingService } from '../_services/permissionsharing.service';
import { PermissionsGuard } from '../_Helper/permissions.guard';
import { RevenueRoutingModule } from './revenue-routing.module';
import { RevenuePopulationComponent } from './revenue-population/revenue-population.component';
import { RevenuePostingComponent } from './revenue-posting/revenue-posting.component';
import { RevenuePostingListComponent } from './revenue-posting-list/revenue-posting-list.component';


@NgModule({
  declarations: [
  RevenuePopulationComponent,
  RevenuePostingComponent,
  RevenuePostingListComponent

  ],
  providers:[
    PermissionsSharingService,
    PermissionsGuard
  ],
  imports: [
    RevenueRoutingModule,
    SharedCustomModule,

  ]
})
export class RevenueModule {
}
