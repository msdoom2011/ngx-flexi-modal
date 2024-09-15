import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {NgComponentOutlet} from "@angular/common";

import {FlexiModalLayoutFooterComponent} from "./footer/flexi-modal-layout-footer.component";
import {FlexiModalLayoutHeaderComponent} from "./header/flexi-modal-layout-header.component";
import {modalWidthPresets} from "../../../../flexi-modals.constants";
import {FlexiModal} from "../../../../modals/flexi-modal";

@Component({
  selector: 'fm-modal-layout',
  standalone: true,
  imports: [
    NgComponentOutlet,
    FlexiModalLayoutFooterComponent,
    FlexiModalLayoutHeaderComponent
  ],
  templateUrl: './flexi-modal-layout.component.html',
  styleUrl: './flexi-modal-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlexiModalLayoutComponent {

  // Inputs
  public modal = input.required<FlexiModal>();


  // Computed

  public isOverlayVisible = computed(() => {
    return (
      this.modal().service.modals().length > 0
      && this.modal().index > 0
    );
  });

  public bodyStyles = computed(() => {
    return {
      ...this._widthStyles(),
      ...this._heightStyles(),
    };
  });

  private _widthStyles = computed(() => {
    const widthOpt = this.modal().config.width || '';
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
    const heightOpt = this.modal().config.height || '';
    const scrollOpt = this.modal().config.scroll || '';
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
