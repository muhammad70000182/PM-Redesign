import { AbstractControl, ValidationErrors } from '@angular/forms';

export function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  // Only validate whitespace if value is a string
  if (typeof value === 'string') {
    const isWhitespace = value.trim().length === 0;
    return isWhitespace ? { required: true } : null;
  }

  // If not a string, consider it valid (or handle it differently if needed)
  return null;
}

