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

  public readonly isOverlayVisible = computed<boolean>(() => {
    const modal = this.modal();

    return (
      !modal.config().maximized
      && modal.service.modals().length > 0
      && modal.index() > 0
    );
  });

  public readonly hostClasses = computed<Array<string>>(() => {
    const { width, height, scroll, maximized, position } = this.modal().config();

    return [
      `scroll-${scroll}`,
      maximized ? 'maximized' : `position-${position}`,
      ...(height && typeof height === 'string' ? [ `height-${height}` ] : []),
      ...(width && typeof width === 'string' ? [ `width-${height}` ] : []),
    ];
  });

  public readonly bodyStyles = computed<Partial<CSSStyleDeclaration>>(() => {
    return {
      ...this._widthStyles(),
      ...this._heightStyles(),
    };
  });

  private readonly _widthStyles = computed<Partial<CSSStyleDeclaration>>(() => {
    const { width: widthOpt, maximized: maximizeOpt } = this.modal().config();

    if (maximizeOpt) {
      return {};
    }

    const styles: Partial<CSSStyleDeclaration> = {
      minWidth: modalWidthPresets['tiny'],
    };

    if (widthOpt in modalWidthPresets) {
      styles.maxWidth = `min(${modalWidthPresets[<keyof typeof modalWidthPresets>widthOpt]}, 100%)`;
      styles.width = '100%';

    } else if (typeof widthOpt === 'number') {
      styles.maxWidth = `min(${widthOpt}px, 100%)`;
      styles.width = '100%';
    }

    return styles;
  });

  private readonly _heightStyles = computed<Partial<CSSStyleDeclaration>>(() => {
    const { height: heightOpt } = this.modal().config();
    const styles: Partial<CSSStyleDeclaration> = {};

    if (typeof heightOpt === 'number') {
      styles.maxHeight = heightOpt + 'px';
    }

    return styles;
  });
}
