import { NgModule } from '@angular/core';

import { CustomFilterPipe } from '../_Helper/custom-filter.pipe';
import { CommonModule } from '@angular/common';
import { AccordionModule, BadgeModule, ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ValidationMessageComponent } from '../_services/validation-message';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DataTablesModule } from 'angular-datatables';
import { CommaSeperatedDirective } from '../_services/comma-seperated.service';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicDecimalPipe } from '../_pipes/decimel-point';


@NgModule({
  declarations: [CustomFilterPipe,DynamicDecimalPipe, ValidationMessageComponent, CommaSeperatedDirective],
  imports: [
    CommonModule,
    BsDatepickerModule.forRoot(),
    TranslateModule.forChild()
  ],
  exports: [
    CustomFilterPipe,
    DynamicDecimalPipe,
    CommonModule,
    DataTablesModule,
    CardModule,
    ButtonModule,
    GridModule,
    IconModule,
    FormModule,
    AccordionModule,
    NgxPaginationModule,
    BadgeModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    ValidationMessageComponent,
    BsDatepickerModule,
    CommaSeperatedDirective,
    TranslateModule 
  ],
})
export class SharedCustomModule {
}
