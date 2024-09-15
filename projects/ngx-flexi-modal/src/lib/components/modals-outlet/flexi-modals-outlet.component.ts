import {ChangeDetectionStrategy, Component, effect, inject, viewChildren} from '@angular/core';
import {NgComponentOutlet, NgForOf, NgTemplateOutlet} from "@angular/common";

import {FlexiModalContainer} from "./modal-container/flexi-modal-container";
import {fadeInOutAnimation} from "../../animations/fade-in-out.animation";
import {FlexiModalsService} from "../../flexi-modals.service";
import {FlexiModal} from "../../modals/flexi-modal";
import {
  FlexiComponentModalContainerComponent
} from "./modal-container/container-types/component/flexi-component-modal-container.component";
import {
  FlexiTemplateModalContainerComponent
} from "./modal-container/container-types/template/flexi-template-modal-container.component";

@Component({
  selector: 'fm-modals-outlet',
  templateUrl: './flexi-modals-outlet.component.html',
  styleUrl: './flexi-modals-outlet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgTemplateOutlet,
    NgComponentOutlet,
    FlexiComponentModalContainerComponent,
    FlexiTemplateModalContainerComponent,
    NgForOf,
  ],
  animations: [
    fadeInOutAnimation('fadeInOut'),
  ],
})
export class FlexiModalsOutletComponent {

  // Dependencies
  private _modalService = inject(FlexiModalsService);

  // Signals
  public modals = this._modalService.modals;

  // Queries
  private _modalsRef = viewChildren<FlexiModalContainer<any, any>>('modals');

  // Private props
  private _styleElement: HTMLStyleElement | null = null;


  // Effects

  private _modalsRefEffect = effect(() => {
    this._modalsRef().forEach((modalRef: FlexiModalContainer<FlexiModal, any>) => {
      const container$ = modalRef.modal().container$;

      container$.next(modalRef);
      container$.complete();
    });
  }, {
    allowSignalWrites: true,
  });

  private _modalsEffect = effect(() => {
    if (this.modals().length > 0 && !this._styleElement) {
      this._styleElement = document.createElement('style');

      this._styleElement.id = 'fm-modals-styles';
      this._styleElement.type = 'text/css';
      this._styleElement.innerHTML = 'body { overflow: hidden }';

      document.getElementsByTagName('head')[0].appendChild(this._styleElement);

    } else if (!this.modals().length && this._styleElement) {
      this._styleElement.remove();
      this._styleElement = null;
    }
  });
}
