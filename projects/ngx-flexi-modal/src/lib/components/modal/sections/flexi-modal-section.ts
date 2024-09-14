import {Directive, TemplateRef, viewChild} from "@angular/core";

@Directive()
export abstract class FlexiModalSection {

  // Queries
  public templateRef = viewChild<TemplateRef<any>>('template');
}
