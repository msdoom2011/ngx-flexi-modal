import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";

import {FlexiModalsThemeService} from "../../../../../../services/theme/flexi-modals-theme.service";
import {IFlexiModalActionConfig} from "../../../../../../services/modals/flexi-modals.definitions";
import {FlexiModalWithComponent} from "../../../../../../models/flexi-modal-with-component";
import {FlexiModalAction} from "../../../../../../models/actions/flexi-modal-action";
import {FlexiModalsOutletComponent} from "../../../../flexi-modals-outlet.component";

@Component({
  selector: 'fm-modal-component-footer',
  standalone: true,
  imports: [ NgTemplateOutlet ],
  templateUrl: './flexi-modal-component-footer.component.html',
  styleUrl: './flexi-modal-component-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlexiModalComponentFooterComponent {

  // Dependencies
  private _modalsOutlet = inject(FlexiModalsOutletComponent);
  private _themeService = inject(FlexiModalsThemeService);

  // Inputs
  public modal = input.required<FlexiModalWithComponent>();

  // Signals
  public actionButtonTpl = this._modalsOutlet.modalActionTpl;
  public themeNameGlobal = this._themeService.themeName;

  // Callbacks

  public onActionClick(actionConfig: IFlexiModalActionConfig, $event: MouseEvent): void {
    const modal = this.modal();

    actionConfig.onClick?.($event, new FlexiModalAction(modal, actionConfig));

    if (actionConfig.closeOnClick) {
      modal.close();
    }
  }


  // Methods

  public getButtonClasses(actionConfig: IFlexiModalActionConfig): Array<string> {
    return [
      actionConfig.position,
      actionConfig.disabled ? 'disabled' : '',
      actionConfig.primary ? 'primary' : '',
      ...(actionConfig.classes || []),
    ]
      .filter(Boolean)
  }
}
