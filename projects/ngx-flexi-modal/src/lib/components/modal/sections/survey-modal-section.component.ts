import {ChangeDetectionStrategy, Component, TemplateRef, viewChild} from "@angular/core";

@Component({
  standalone: true,
  templateUrl: './survey-modal-section.component.html',
  styleUrl: './survey-modal-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class SurveyModalSectionComponent {

  // Queries
  public templateRef = viewChild<TemplateRef<any>>('template');
}
