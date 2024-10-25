import { ComponentRef, Type } from '@angular/core';

import {IFmModalWithComponentConfig, IFmModalWithComponentOptions} from '../services/modals/flexi-modals.definitions';
import { FmModalType } from '../services/modals/flexi-modals.constants';
import {FmModal} from './fm-modal';

export class FmModalWithComponent<
  ComponentT extends object = any,
  InputsT extends object = Record<string, any>
>
extends FmModal<
  IFmModalWithComponentConfig<ComponentT, InputsT>,
  IFmModalWithComponentOptions<ComponentT, InputsT>,
  ComponentRef<ComponentT>,
  Type<ComponentT> | Promise<Type<ComponentT>>
>{

  public readonly type = FmModalType.Component;
}
