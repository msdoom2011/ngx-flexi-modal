import {Directive, inject, TemplateRef} from "@angular/core";

@Directive({
  selector: '[fmModalBody]',
  standalone: true,
})
export class FlexiModalBodyDirective {

  public readonly templateRef = inject(TemplateRef);
}