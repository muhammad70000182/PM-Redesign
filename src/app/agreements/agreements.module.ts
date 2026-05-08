import { NgModule } from '@angular/core';

import { SharedCustomModule } from '../shared-module/sharedCustom.module';
import { PermissionsSharingService } from '../_services/permissionsharing.service';
import { PermissionsGuard } from '../_Helper/permissions.guard';
import { AgreementsRoutingModule } from './agreements-routing.module';
import { SaleAgreementComponent } from './sale-agreement/sale-agreement.component';
import { AgreementListingComponent } from './agreement-listing/agreement-listing.component';
import { PerformaInvoiceComponent } from './performa-invoice/performa-invoice.component';
import { OwnershipTransferComponent } from './ownership-transfer/ownership-transfer.component';
import { performaInvoicelistingComponent } from './performa-Invoice-listing/performa-Invoice-listing.component';
import { ownershiptransferlistComponent } from './ownership-transfer-list/ownership-transfer-list.component';
import { UnitDelivery } from './unit-delivery/unit-delivery.component';
import { UnitDeliveryNewComponent } from './unit-delivery-new/unit-delivery-new.component';
import { SuspensionsComponent } from './suspensions/suspensions.component';
import { SuspensionListingComponent } from './suspension-listing/suspension-listing.component';
import { unitreturnlistComponent } from './unit-return-list/unit-return-list.component';
import { unitreturnComponent } from './unit-return/unit-return.component';
import { BulkInstallmentsComponent } from './bulk-installments-posting/bulk-installments-posting.component';
import { BulkSubmittedAgreementsComponent } from './bulk-submitted-agreements/bulk-submitted-agreements.component';
import { BulkInstallmentsListComponent } from './bulk-installments-list/bulk-installments-list.component';


@NgModule({
  declarations: [
    SaleAgreementComponent,
    AgreementListingComponent,
    PerformaInvoiceComponent,
    OwnershipTransferComponent,
    performaInvoicelistingComponent,
    ownershiptransferlistComponent,
    UnitDelivery,
    UnitDeliveryNewComponent,
    SuspensionsComponent,
    SuspensionListingComponent,
    unitreturnlistComponent,
    unitreturnComponent,
    BulkInstallmentsComponent,
    BulkSubmittedAgreementsComponent,
    BulkInstallmentsListComponent
  ],
  providers: [
    PermissionsSharingService,
    PermissionsGuard
  ],
  imports: [

    AgreementsRoutingModule,
    SharedCustomModule
  ]
})
export class AgreementsModule {
}
