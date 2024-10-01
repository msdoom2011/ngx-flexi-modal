import {Directive, inject, TemplateRef} from '@angular/core';

@Directive({
  selector: '[fmModalBody]',
  standalone: true,
})
export class FmModalBodyDirective {

  public readonly templateRef = inject(TemplateRef);
}
