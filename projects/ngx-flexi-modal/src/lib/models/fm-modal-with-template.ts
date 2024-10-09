import {EmbeddedViewRef, TemplateRef} from '@angular/core';

import {IFmModalWithTemplateConfig, IFmModalWithTemplateOptions} from '../services/modals/flexi-modals.definitions';
import {FM_MODAL_WITH_TEMPLATE_TYPE} from '../services/modals/flexi-modals.constants';
import {FmModal} from './fm-modal';

export class FmModalWithTemplate<ContextT extends Record<string, unknown> = any>
extends FmModal<
  IFmModalWithTemplateConfig<ContextT>,
  IFmModalWithTemplateOptions<ContextT>,
  EmbeddedViewRef<ContextT>,
  TemplateRef<ContextT>
>{

  public readonly type = FM_MODAL_WITH_TEMPLATE_TYPE;
}
