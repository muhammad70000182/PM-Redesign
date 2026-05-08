import {
  Directive,
  HostListener,
  ElementRef,
  forwardRef,
  Input
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Directive({
  selector: '[appCommaSeparated]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CommaSeperatedDirective),
      multi: true
    }
  ]
})
export class CommaSeperatedDirective implements ControlValueAccessor {
  @Input() allowDecimal: boolean = true; // ✅ default: allows decimals

  private onChange = (_: any) => { };
  private onTouched = () => { };

  constructor(private el: ElementRef<HTMLInputElement>) { }

  @HostListener('input', ['$event'])
  onInput(event: any) {
    let inputValue: string = event.target.value;

    // ✅ Allow only digits (and dot if allowed)
    const allowedPattern = this.allowDecimal ? /[^0-9.]/g : /[^0-9]/g;
    inputValue = inputValue.replace(allowedPattern, '');

    // ✅ Allow only one dot if decimals are allowed
    if (this.allowDecimal) {
      const firstDotIndex = inputValue.indexOf('.');
      if (firstDotIndex !== -1) {
        const beforeDot = inputValue.substring(0, firstDotIndex + 1);
        const afterDot = inputValue.substring(firstDotIndex + 1).replace(/\./g, '');
        inputValue = beforeDot + afterDot;
      }
    }

    const floatValue = parseFloat(inputValue);

    if (!isNaN(floatValue)) {
      this.onChange(floatValue);
      event.target.value = this.formatWithCommas(inputValue);
    } else {
      this.onChange('');
      event.target.value = '';
    }
  }

  @HostListener('blur')
  onBlur() {
    this.onTouched();
  }
  writeValue(value: any): void {
    if (value !== null && value !== undefined && value !== '') {
      const num = parseFloat(value.toString().replace(/,/g, ''));
      if (!isNaN(num)) {
        const roundedValue = this.allowDecimal ? num.toFixed(2) : Math.floor(num).toString();
        this.el.nativeElement.value = this.formatWithCommas(roundedValue);
      } else {
        this.el.nativeElement.value = '';
      }
    } else {
      this.el.nativeElement.value = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  private formatWithCommas(value: string): string {
    const parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
}
