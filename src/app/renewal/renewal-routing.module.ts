import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionsGuard } from '../_Helper/permissions.guard';
import { QuotationGenerationComponent } from './quotation-generation/quotation-generation.component';
const routes: Routes = [
  { path: '', component: QuotationGenerationComponent, canActivate: [PermissionsGuard], data: { title: 'Quotation Generation' } },
  { path: 'quotation-generation', component: QuotationGenerationComponent, canActivate: [PermissionsGuard], data: { title: 'Quotation Generation' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RenewalRoutingModule {
}
