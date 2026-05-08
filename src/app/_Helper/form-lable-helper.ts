import { Injectable, ElementRef, Renderer2 } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class FormLabelHelper {
  markRequiredFields(form: FormGroup, el: ElementRef | HTMLElement, renderer: Renderer2): void {
    const host: HTMLElement = (el as ElementRef)?.nativeElement ?? (el as HTMLElement);

    Object.keys(form.controls).forEach((controlName) => {
      
      const control = form.get(controlName);
      if (!control || !control.validator) return;

      const validator = control.validator({} as any);
      const isRequired = validator && validator['required'];
      if (!isRequired) return;

      // Find the input inside this form
      const input = host.querySelector(`[formcontrolname="${controlName}"]`);
      if (!input) return;

      // Walk up DOM to find <label>
      let parent: HTMLElement | null = input.parentElement;
      let label: HTMLElement | null = null;

      while (parent && !label) {
        label = parent.querySelector('label');
        parent = parent.parentElement;
      }

      if (label && !label.classList.contains('label-required')) {
        renderer.addClass(label, 'label-required');
      }
    });
  }

}
