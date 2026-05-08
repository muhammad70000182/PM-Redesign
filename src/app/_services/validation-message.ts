import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-validation-message',
  template: `
<div *ngIf="control && control.invalid && (control.dirty || control.touched || submitted)" class="invalid-feedback d-block">
  <div *ngIf="control.errors?.['required']">{{ label }} is required</div>
  <div *ngIf="control.errors?.['email']">Invalid email address</div>
  <div *ngIf="control.errors?.['maxlength']">
    Maximum {{ control.errors?.['maxlength']?.requiredLength }} characters allowed
  </div>
  <div *ngIf="control.errors?.['minlength']">
    Minimum {{ control.errors?.['minlength']?.requiredLength }} characters required
  </div>
  <div *ngIf="control.errors?.['pattern']">
    {{ customMessages['pattern'] || ('Invalid ' + (label | lowercase) + ' format') }}
  </div>
    <div *ngIf="control.errors?.['min']">
    Minimum value is {{ control.errors?.['min']?.min }}
  </div>
  <div *ngIf="control.errors?.['max']">
    Maximum value is {{ control.errors?.['max']?.max }}
  </div>
</div>
`
})
export class ValidationMessageComponent {
  @Input() control!: AbstractControl | null;
  @Input() label = '';
  @Input() submitted = false;
  @Input() customMessages: { [key: string]: string } = {};
}
