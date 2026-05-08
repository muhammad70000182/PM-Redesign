import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dynamicDecimal'
})
export class DynamicDecimalPipe implements PipeTransform {
  transform(value: any, decimals: number = 2): string {
    if (value == null || value === '') return '';
    const num = parseFloat(value);
    if (isNaN(num)) return value;

    // ✅ Format number with comma separators and fixed decimals
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }
}
