import { EmbeddedViewRef, TemplateRef } from '@angular/core';

import { IFmModalWithTemplateConfig, IFmModalWithTemplateOptions } from '../services/modals/flexi-modals.definitions';
import { FmModalType } from '../services/modals/flexi-modals.constants';
import { FmModal } from './fm-modal';

export class FmModalWithTemplate<
  ContextT extends object = any
>
extends FmModal<
  IFmModalWithTemplateConfig<ContextT>,
  IFmModalWithTemplateOptions<ContextT>,
  EmbeddedViewRef<ContextT>,
  TemplateRef<ContextT>
>{

  public readonly type = FmModalType.Template;
}
