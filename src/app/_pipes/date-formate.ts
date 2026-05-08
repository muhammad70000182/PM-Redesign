// generic-date.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SharedHelper } from '../_Helper/SharedHelper';


@Pipe({
  name: 'appDate',
  pure: false   // <-- important if format can change at runtime
})
export class GenericDatePipe implements PipeTransform {
  constructor(
    private datePipe: DatePipe,
    private helper: SharedHelper
  ) {}

  transform(value: any, format?: string): string | null {
    // if caller passes a format explicitly, use it; otherwise use the DB one
    const fmt = format || this.helper.getGenericFormate();
    return this.datePipe.transform(value, );
  }
}
