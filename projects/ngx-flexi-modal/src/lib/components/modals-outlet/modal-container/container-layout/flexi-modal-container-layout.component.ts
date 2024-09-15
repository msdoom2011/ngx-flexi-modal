import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {NgComponentOutlet} from "@angular/common";

import {FlexiModalContainerFooterComponent} from "./container-footer/flexi-modal-container-footer.component";
import {FlexiModalContainerHeaderComponent} from "./container-header/flexi-modal-container-header.component";
import {modalWidthPresets} from "../../../../flexi-modals.constants";
import {IFlexiModalConfig} from "../../../../flexi-modals.models";
import {FlexiModalContainer} from "../flexi-modal-container";

@Component({
  selector: 'fm-modal-container-layout',
  standalone: true,
  imports: [
    NgComponentOutlet,
    FlexiModalContainerFooterComponent,
    FlexiModalContainerHeaderComponent
  ],
  templateUrl: './flexi-modal-container-layout.component.html',
  styleUrl: './flexi-modal-container-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlexiModalContainerLayoutComponent {

  // Inputs
  public config = input.required<IFlexiModalConfig<any>>();
  public modal = input.required<FlexiModalContainer<any, any>>();


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
