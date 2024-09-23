import {ChangeDetectionStrategy, Component, effect, ElementRef, inject} from '@angular/core';
import {NgComponentOutlet, NgForOf, NgTemplateOutlet} from "@angular/common";

import {FlexiModalThemeService} from "../../services/theme/flexi-modal-theme.service";
import {fadeInOutAnimation} from "../../animations/fade-in-out.animation";
import {FlexiModalsService} from "../../flexi-modals.service";
import {
  FlexiModalComponentInstanceComponent
} from "./modal-instance/instance-types/component/flexi-modal-component-instance.component";
import {
  FlexiModalTemplateInstanceComponent
} from "./modal-instance/instance-types/template/flexi-modal-template-instance.component";

@Component({
  selector: 'fm-modals-outlet',
  templateUrl: './flexi-modals-outlet.component.html',
  styleUrl: './flexi-modals-outlet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgTemplateOutlet,
    NgComponentOutlet,
    FlexiModalComponentInstanceComponent,
    FlexiModalTemplateInstanceComponent,
    NgForOf,
  ],
  animations: [
    fadeInOutAnimation('fadeInOut'),
  ],
})
export class FlexiModalsOutletComponent {

  // Dependencies
  private _service = inject(FlexiModalsService);
  private _themes = inject(FlexiModalThemeService);
  private _elementRef = inject(ElementRef<HTMLElement>);

  // Signals
  public modals = this._service.modals;
  public theme = this._themes.theme;

  // Private props
  private _bodyStyle: HTMLStyleElement | null = null;


  // Effects

  private _modalsEffect = effect(() => {
    if (this.modals().length > 0 && !this._bodyStyle) {
      this._bodyStyle = document.createElement('style');

      this._bodyStyle.id = 'fm-modals-styles';
      this._bodyStyle.type = 'text/css';
      this._bodyStyle.innerHTML = 'body { overflow: hidden }';

      document.getElementsByTagName('head')[0].appendChild(this._bodyStyle);

    } else if (!this.modals().length && this._bodyStyle) {
      this._bodyStyle.remove();
      this._bodyStyle = null;
    }
  });

  private _themeEffect = effect(() => {
    this._themes.applyThemeStyles(this._elementRef.nativeElement);
  });
}
