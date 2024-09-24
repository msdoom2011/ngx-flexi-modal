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
  host: {
    '[class]': 'hostClasses()'
  }
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
    const modal = this.modal();

    return (
      !modal.config().stretch
      && modal.service.modals().length > 0
      && modal.index > 0
    );
  });

  public readonly hostClasses = computed(() => {
    return 'position-' + this.modal().config().position;
  });

  public readonly bodyClasses = computed(() => {
    const { width, height, scroll, stretch } = this.modal().config();

    if (stretch) {
      return [
        'stretched',
        'scroll-content',
      ];
    }

    return [
      `scroll-${scroll}`,
      ...(height && typeof height === 'string' ? [ `height-${height}` ] : []),
      ...(width && typeof width === 'string' ? [ `width-${height}` ] : []),
    ];
  });

  public readonly bodyStyles = computed(() => {
    return {
      ...this._widthStyles(),
      ...this._heightStyles(),
    };
  });

  private readonly _widthStyles = computed(() => {
    const { width: widthOpt, stretch: stretchOpt } = this.modal().config();

    if (stretchOpt) {
      return {
        width: '100%',
        minWidth: '100%',
        maxWidth: '100%'
      };
    }

    const styles: Partial<CSSStyleDeclaration> = {
      minWidth: modalWidthPresets['tiny'],
      width: '100%',
    };

    if (widthOpt in modalWidthPresets) {
      styles.maxWidth = `min(${modalWidthPresets[<keyof typeof modalWidthPresets>widthOpt]}, 100%)`;

    } else if (typeof widthOpt === 'number') {
      styles.maxWidth = `min(${widthOpt}px, 100%)`;

    } else {
      switch (widthOpt) {
        case 'fit-content':
          styles.maxWidth = '100%';
          styles.width = '';
          break;

        case 'fit-window':
          styles.maxWidth = '100%';
          styles.width = '100%';
          break;
      }
    }

    return styles;
  });

  private readonly _heightStyles = computed(() => {
    const { height: heightOpt, scroll: scrollOpt, stretch: stretchOpt } = this.modal().config();

    if (stretchOpt) {
      return {
        height: '100%',
        minHeight: '100%',
        maxHeight: '100%'
      };
    }

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
