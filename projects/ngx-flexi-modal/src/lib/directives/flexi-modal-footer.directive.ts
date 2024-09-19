import {Directive, inject, TemplateRef} from '@angular/core';

@Directive({
  selector: '[fmModalFooter]',
  standalone: true,
})
export class FlexiModalFooterDirective {

  public templateRef = inject(TemplateRef);
}