import {ChangeDetectionStrategy, Component, input, TemplateRef} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";

@Component({
  selector: 'sw-modal-container-header',
  standalone: true,
  imports: [
    NgTemplateOutlet
  ],
  templateUrl: './survey-modal-container-header.component.html',
  styleUrl: './survey-modal-container-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurveyModalContainerHeaderComponent {

  // Imports
  public title = input<string>();
  public headerTpl = input<TemplateRef<any>>();
}
