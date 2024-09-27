import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  ElementRef,
  inject,
  TemplateRef
} from '@angular/core';
import {NgComponentOutlet, NgForOf, NgTemplateOutlet} from "@angular/common";
import {animate, style, transition, trigger} from "@angular/animations";

import {FlexiModalActionTplDirective} from "./directives/flexi-modal-action-tpl.directive";
import {FlexiModalHeaderTplDirective} from "./directives/flexi-modal-header-tpl.directive";
import {FlexiModalsThemeService} from "../../services/theme/flexi-modals-theme.service";
import {FlexiModalsService} from "../../services/modals/flexi-modals.service";
import {FlexiModal} from "../../models/flexi-modal";
import {
  FlexiModalWithComponentInstanceComponent
} from "./modal-instance/instance-types/component/flexi-modal-with-component-instance.component";
import {
  FlexiModalWithTemplateInstanceComponent
} from "./modal-instance/instance-types/template/flexi-modal-with-template-instance.component";

@Component({
  selector: 'fm-modals-outlet',
  templateUrl: './flexi-modals-outlet.component.html',
  styleUrl: './flexi-modals-outlet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgTemplateOutlet,
    NgComponentOutlet,
    FlexiModalWithComponentInstanceComponent,
    FlexiModalWithTemplateInstanceComponent,
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
  private readonly _service = inject(FlexiModalsService);
  private readonly _themes = inject(FlexiModalsThemeService);
  private readonly _elementRef = inject(ElementRef<HTMLElement>);

  // Signals
  public readonly modals = this._service.modals;
  public readonly theme = this._themes.theme;

  // Queries
  private readonly _modalActionTplRef = contentChild(FlexiModalActionTplDirective);
  private readonly _modalHeaderTplRef = contentChild(FlexiModalHeaderTplDirective);

  // Private props
  private _bodyStyleElement: HTMLStyleElement | null = null;


  // Computed props

  public readonly modalActive = computed<FlexiModal | undefined>(() => {
    return this._service.getModalActive();
  });

  public readonly modalActionTpl = computed<TemplateRef<any> | undefined>(() => {
    return this._modalActionTplRef()?.templateRef;
  });

  public readonly modalHeaderTpl = computed<TemplateRef<any> | undefined>(() => {
    return this._modalHeaderTplRef()?.templateRef;
  });


  // Effects

  private readonly _modalsEffect = effect(() => {
    if (this.modals().length > 0 && !this._bodyStyleElement) {
      this._bodyStyleElement = document.createElement('style');

      this._bodyStyleElement.id = 'fm-modals-styles';
      this._bodyStyleElement.type = 'text/css';
      this._bodyStyleElement.innerHTML = 'body { overflow: hidden }';

      document.getElementsByTagName('head')[0].appendChild(this._bodyStyleElement);

    } else if (!this.modals().length && this._bodyStyleElement) {
      this._bodyStyleElement.remove();
      this._bodyStyleElement = null;
    }
  });

  private readonly _themeEffect = effect(() => {
    this._themes.applyThemeStyles(this._elementRef.nativeElement);
  });
}
