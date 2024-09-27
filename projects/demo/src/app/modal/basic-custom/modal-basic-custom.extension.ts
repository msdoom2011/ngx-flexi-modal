import {flexiModalBasicExtension} from "ngx-flexi-modal";
import {ModalBasicCustomComponent} from "./modal-basic-custom.component";

export const modalBasicCustomExtension = {
  error: {...flexiModalBasicExtension.error, component: ModalBasicCustomComponent },
  warning: {...flexiModalBasicExtension.warning, component: ModalBasicCustomComponent },
  success: {...flexiModalBasicExtension.success, component: ModalBasicCustomComponent },
  info: {...flexiModalBasicExtension.info, component: ModalBasicCustomComponent },
  confirm: {...flexiModalBasicExtension.confirm, component: ModalBasicCustomComponent },
};
