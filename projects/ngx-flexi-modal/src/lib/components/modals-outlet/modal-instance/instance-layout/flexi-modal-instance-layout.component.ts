import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {NgComponentOutlet, NgTemplateOutlet} from "@angular/common";

import {FlexiModalInstanceFooterComponent} from "./footer/flexi-modal-instance-footer.component";
import {FlexiModalInstanceHeaderComponent} from "./header/flexi-modal-instance-header.component";
import {FlexiModalsThemeService} from "../../../../services/theme/flexi-modals-theme.service";
import {modalWidthPresets} from "../../../../services/modals/flexi-modals.constants";
import {FlexiModal} from "../../../../models/flexi-modal";

@Component({
  selector: 'fm-modal-instance-layout',
  templateUrl: './flexi-modal-instance-layout.component.html',
  styleUrl: './flexi-modal-instance-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgComponentOutlet,
    FlexiModalInstanceFooterComponent,
    FlexiModalInstanceHeaderComponent,
    NgTemplateOutlet
  ],
})
export class FlexiModalInstanceLayoutComponent {

  // Dependencies
  private readonly _themeService = inject(FlexiModalsThemeService);

  // Inputs
  public readonly modal = input.required<FlexiModal>();

  // Signals
  public readonly theme = this._themeService.theme;


  // Computed

  public readonly isOverlayVisible = computed(() => {
    return (
      this.modal().service.modals().length > 0
      && this.modal().index > 0
    );
  });

  public readonly bodyStyles = computed(() => {
    return {
      ...this._widthStyles(),
      ...this._heightStyles(),
    };
  });

  private readonly _widthStyles = computed(() => {
    const widthOpt = this.modal().config.width || '';
    const styles: Partial<CSSStyleDeclaration> = {
      minWidth: modalWidthPresets['tiny'],
      width: '100%',
    };

    if (widthOpt in modalWidthPresets) {
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

  private readonly _heightStyles = computed(() => {
    const heightOpt = this.modal().config.height || '';
    const scrollOpt = this.modal().config.scroll || '';
    const styles: Partial<CSSStyleDeclaration> = {
      minHeight: '120px',
    };

    if (scrollOpt === 'modal') {
      return styles;

    } else if (heightOpt === 'fit-content') {
      styles.maxHeight = '100%';

    } else if (typeof heightOpt === 'number') {
      styles.maxHeight = heightOpt + 'px';
    }

    return styles;
  });
}
