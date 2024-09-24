import {ChangeDetectionStrategy, Component, computed, contentChild, effect, ElementRef, inject} from '@angular/core';
import {NgComponentOutlet, NgForOf, NgTemplateOutlet} from "@angular/common";
import {animate, style, transition, trigger} from "@angular/animations";

import {FlexiModalActionButtonDirective} from "./directives/flexi-modal-action-button.directive";
import {FlexiModalsThemeService} from "../../services/theme/flexi-modals-theme.service";
import {FlexiModalsService} from "../../services/modals/flexi-modals.service";
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
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(`300ms ease-in-out`, style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate(`300ms ease-in-out`, style({ opacity: 0 }))
      ])
    ])
  ],
})
export class FlexiModalsOutletComponent {

  // Dependencies
  private _service = inject(FlexiModalsService);
  private _themes = inject(FlexiModalsThemeService);
  private _elementRef = inject(ElementRef<HTMLElement>);

  // Signals
  public modals = this._service.modals;
  public theme = this._themes.theme;

  // Queries
  private _actionButtonRef = contentChild(FlexiModalActionButtonDirective);

  // Private props
  private _bodyStyle: HTMLStyleElement | null = null;


  // Computed props

  public actionButtonTpl = computed(() => {
    return this._actionButtonRef()?.templateRef;
  });


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
