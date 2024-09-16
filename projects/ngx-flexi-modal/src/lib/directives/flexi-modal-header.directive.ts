import {Directive, inject, TemplateRef} from '@angular/core';

@Directive({
  selector: '[fmModalHeader]',
  standalone: true,
})
export class FlexiModalHeaderDirective {

  public templateRef = inject(TemplateRef);
}
