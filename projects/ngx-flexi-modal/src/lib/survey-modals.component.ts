import {ChangeDetectionStrategy, Component, effect, inject, viewChildren} from '@angular/core';
import {NgComponentOutlet, NgForOf, NgTemplateOutlet} from "@angular/common";

import {SurveyModalContainerComponent} from "./components/modal-container/survey-modal-container.component";
import {modalBasicExtension} from "./modals/basic/survey-modal-basic.extension";
import {fadeInOutAnimation} from "./animations/fade-in-out.animation";
import {SURVEY_MODAL_EXTENSION} from "./survey-modals.tokens";
import {SurveyModalsService} from "./survey-modals.service";
import {
  SurveyComponentModalContainerComponent
} from "./components/modal-container/container-types/component-container/survey-component-modal-container.component";
import {
  SurveyTemplateModalContainerComponent
} from "./components/modal-container/container-types/template-container/survey-template-modal-container.component";

@Component({
  selector: 'sw-modals',
  templateUrl: './survey-modals.component.html',
  styleUrl: './survey-modals.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgTemplateOutlet,
    NgComponentOutlet,
    SurveyComponentModalContainerComponent,
    SurveyTemplateModalContainerComponent,
    NgForOf,
  ],
  providers: [
    { provide: SURVEY_MODAL_EXTENSION, useValue: modalBasicExtension, multi: true },
  ],
  animations: [
    fadeInOutAnimation('fadeInOut'),
  ],
})
export class SurveyModalsComponent {

  // Dependencies
  private _modalService = inject(SurveyModalsService);

  // Signals
  public modals = this._modalService.modals;

  // Queries
  private _modalsRef = viewChildren<SurveyModalContainerComponent<any, any>>('modals');

  // Private props
  private _styleElement: HTMLStyleElement | null = null;


  // Effects

  private _modalsRefEffect = effect(() => {
    this._modalsRef().forEach(modalRef => {
      const modal$ = modalRef.config().modal$;

      modal$.next(modalRef);
      modal$.complete();
    });
  }, {
    allowSignalWrites: true,
  });

  private _modalsEffect = effect(() => {
    if (this.modals().length > 0 && !this._styleElement) {
      this._styleElement = document.createElement('style');

      this._styleElement.id = 'sw-modals-styles';
      this._styleElement.type = 'text/css';
      this._styleElement.innerHTML = 'body { overflow: hidden }';

      document.getElementsByTagName('head')[0].appendChild(this._styleElement);

    } else if (!this.modals().length && this._styleElement) {
      this._styleElement.remove();
      this._styleElement = null;
    }
  });
}
