import { NgModule } from '@angular/core';
import { SharedCustomModule } from '../shared-module/sharedCustom.module';
import { PermissionsSharingService } from '../_services/permissionsharing.service';
import { PermissionsGuard } from '../_Helper/permissions.guard';
import { RenewalRoutingModule } from './renewal-routing.module';
import { QuotationGenerationComponent } from './quotation-generation/quotation-generation.component';


@NgModule({
  declarations: [
  QuotationGenerationComponent
  ],
  providers:[
    PermissionsSharingService,
    PermissionsGuard
  ],
  imports: [
    RenewalRoutingModule,
    SharedCustomModule
  ]
})
export class RenewalModule {
}
