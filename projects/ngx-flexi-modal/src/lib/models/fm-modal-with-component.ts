import {ComponentRef, Type} from '@angular/core';

import {IFmModalWithComponentConfig, IFmModalWithComponentOptions} from '../services/modals/flexi-modals.definitions';
import {FM_MODAL_WITH_COMPONENT_TYPE} from '../services/modals/flexi-modals.constants';
import {FmModal} from './fm-modal';

export class FmModalWithComponent<
  ComponentT = any,
  InputsT extends object = Record<string, any>
>
extends FmModal<
  IFmModalWithComponentConfig<ComponentT, InputsT>,
  IFmModalWithComponentOptions<ComponentT, InputsT>,
  ComponentRef<ComponentT>,
  Type<ComponentT>
>{

  public readonly type = FM_MODAL_WITH_COMPONENT_TYPE;
}
