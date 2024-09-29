import {Directive, inject, TemplateRef} from '@angular/core';

@Directive({
  selector: '[fmModalFooter]',
  standalone: true,
})
export class FmModalFooterDirective {

  public readonly templateRef = inject(TemplateRef);
}
