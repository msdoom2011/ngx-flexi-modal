import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';

import {FlexiModalsThemeService} from '../../../../../../services/theme/flexi-modals-theme.service';
import {IFmModalActionConfig} from '../../../../../../services/modals/flexi-modals.definitions';
import {FmModalWithComponent} from '../../../../../../models/fm-modal-with-component';
import {FmModalAction} from '../../../../../../models/actions/fm-modal-action';
import {FmModalsOutletComponent} from '../../../../fm-modals-outlet.component';

@Component({
  selector: 'fm-modal-with-component-footer',
  standalone: true,
  imports: [ NgTemplateOutlet ],
  templateUrl: './fm-modal-with-component-footer.component.html',
  styleUrl: './fm-modal-with-component-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FmModalWithComponentFooterComponent {

  // Dependencies
  private readonly _outlet = inject(FmModalsOutletComponent);
  private readonly _themes = inject(FlexiModalsThemeService);

  // Inputs
  public readonly modal = input.required<FmModalWithComponent>();

  // Signals
  public readonly actionButtonTpl = this._outlet.modalActionTpl;
  public readonly themeNameGlobal = this._themes.themeName;


  // Callbacks

  public onActionClick(actionConfig: IFmModalActionConfig, $event: MouseEvent): void {
    const modal = this.modal();

    actionConfig.onClick?.($event, new FmModalAction(modal, actionConfig));

    if (actionConfig.closeOnClick) {
      modal.close();
    }
  }


  // Methods

  public getButtonClasses(actionConfig: IFmModalActionConfig): Array<string> {
    return [
      actionConfig.position,
      actionConfig.disabled ? 'disabled' : '',
      actionConfig.primary ? 'primary' : '',
      ...(actionConfig.classes || []),
    ]
      .filter(Boolean)
  }
}
