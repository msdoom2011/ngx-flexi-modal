import { fmModalBasicPresets } from 'ngx-flexi-modal';
import { ModalBasicCustomComponent } from './modal-basic-custom.component';

export const modalBasicCustomPresets = {
  error: { ...fmModalBasicPresets.error, component: ModalBasicCustomComponent },
  warning: { ...fmModalBasicPresets.warning, component: ModalBasicCustomComponent },
  success: { ...fmModalBasicPresets.success, component: ModalBasicCustomComponent },
  info: { ...fmModalBasicPresets.info, component: ModalBasicCustomComponent },
  confirm: { ...fmModalBasicPresets.confirm, component: ModalBasicCustomComponent },
};
