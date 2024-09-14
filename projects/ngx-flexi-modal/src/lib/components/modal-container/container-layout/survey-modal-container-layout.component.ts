import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {NgComponentOutlet} from "@angular/common";

import {SurveyModalContainerFooterComponent} from "./container-footer/survey-modal-container-footer.component";
import {SurveyModalContainerHeaderComponent} from "./container-header/survey-modal-container-header.component";
import {SurveyModalContainerComponent} from "../survey-modal-container.component";
import {modalWidthPresets} from "../../../survey-modals.constants";
import {ISurveyModalConfig} from "../../../survey-modals.models";

@Component({
  selector: 'sw-modal-container-layout',
  standalone: true,
  imports: [
    NgComponentOutlet,
    SurveyModalContainerFooterComponent,
    SurveyModalContainerHeaderComponent
  ],
  templateUrl: './survey-modal-container-layout.component.html',
  styleUrl: './survey-modal-container-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurveyModalContainerLayoutComponent {

  // Inputs
  public config = input.required<ISurveyModalConfig<any>>();
  public modal = input.required<SurveyModalContainerComponent<any, any>>();


  // Computed

  public isOverlayVisible = computed(() => {
    return (
      this.modal().modalService.modals().length > 0
      && this.modal().index() > 0
    );
  });

  public bodyStyles = computed(() => {
    return {
      ...this._widthStyles(),
      ...this._heightStyles(),
    };
  });

  private _widthStyles = computed(() => {
    const widthOpt = this.config()?.width || '';
    const styles: Partial<CSSStyleDeclaration> = {
      minWidth: modalWidthPresets['tiny'],
      width: '100%',
    };

    if (modalWidthPresets.hasOwnProperty(widthOpt)) {
      styles.maxWidth = modalWidthPresets[<keyof typeof modalWidthPresets>widthOpt];

    } else if (typeof widthOpt === 'number') {
      styles.maxWidth = widthOpt + 'px';

    } else {
      switch (widthOpt) {
        case 'fit-content':
          styles.maxWidth = '100%';
          styles.width = '';
          break;

        case 'fit-window':
          styles.minWidth = '100%';
          break;
      }
    }

    return styles;
  });

  private _heightStyles = computed(() => {
    const heightOpt = this.config()?.height || '';
    const scrollOpt = this.config()?.scroll || '';
    const styles: Partial<CSSStyleDeclaration> = {
      minHeight: '120px',
    };

    if (scrollOpt === 'modal') {
      return styles;
    }

    if (heightOpt === 'fit-content') {
      styles.maxHeight = '100%';

    } else if (typeof heightOpt === 'number') {
      styles.maxHeight = heightOpt + 'px';
    }

    return styles;
  });
}
