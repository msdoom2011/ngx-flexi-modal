import { inject, Injectable, Injector } from '@angular/core';

import { FlexiModalsThemeService } from '../../theme/flexi-modals-theme.service';
import { FLEXI_MODAL_DEFAULT_OPTIONS } from '../../../flexi-modals.tokens';
import { fmModalOptionsDefault } from '../flexi-modals.constants';
import { IFmModalOptions } from '../flexi-modals.definitions';
import { FlexiModalsService } from '../flexi-modals.service';
import { FmModal } from '../../../models/fm-modal';
import { normalizeOptions } from '../../../tools/utils';

@Injectable()
export abstract class FmModalFactory<ModalT extends FmModal> {

  protected readonly _defaultOptions = inject<IFmModalOptions | undefined>(FLEXI_MODAL_DEFAULT_OPTIONS, { optional: true });

  protected readonly _injector = inject(Injector);

  private _service!: FlexiModalsService;

  private _themes!: FlexiModalsThemeService;

  protected get service(): FlexiModalsService {
    return this._service || (this._service = this._injector.get(FlexiModalsService));
  }

  protected get themes(): FlexiModalsThemeService {
    return this._themes || (this._themes = this._injector.get(FlexiModalsThemeService));
  }

  public abstract test(subject: unknown): boolean;

  public abstract create(subject: unknown, options: IFmModalOptions<any>): ModalT | null;

  protected _normalizeOptions<ModalOptionsT extends Partial<IFmModalOptions<any>>>(options: ModalOptionsT): ModalOptionsT {
    return <ModalOptionsT>{
      ...fmModalOptionsDefault,
      ...(this._defaultOptions || {}),
      ...normalizeOptions(options),
    };
  }
}
