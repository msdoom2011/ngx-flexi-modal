import {fmModalBasicExtension} from "ngx-flexi-modal";
import {ModalBasicCustomComponent} from "./modal-basic-custom.component";

export const modalBasicCustomExtension = {
  error: {...fmModalBasicExtension.error, component: ModalBasicCustomComponent },
  warning: {...fmModalBasicExtension.warning, component: ModalBasicCustomComponent },
  success: {...fmModalBasicExtension.success, component: ModalBasicCustomComponent },
  info: {...fmModalBasicExtension.info, component: ModalBasicCustomComponent },
  confirm: {...fmModalBasicExtension.confirm, component: ModalBasicCustomComponent },
};
