import {FlexiModalBasicComponent} from "./components/modal-basic/flexi-modal-basic.component";
import {MODAL_NO_BUTTON_ID, MODAL_YES_BUTTON_ID} from "./flexi-modal-basic.constants";
import {IFlexiModalBasicOptionsByTypes} from "./flexi-modal-basic.definitions";
import {IFlexiModalExtension} from "../../services/modals/flexi-modals.definitions";
import {extendModalOptions} from "./flexi-modal-basic.helpers";

export const flexiModalBasicExtension: IFlexiModalExtension<IFlexiModalBasicOptionsByTypes> = {

  error: {
    component: FlexiModalBasicComponent,
    convert: (config: IFlexiModalBasicOptionsByTypes['error']) => extendModalOptions({
      title: 'Error',
      width: 'small',
      inputs: {
        icon: 'error'
      },
    }, config)
  },

  warning: {
    component: FlexiModalBasicComponent,
    convert: (config: IFlexiModalBasicOptionsByTypes['warning']) => extendModalOptions({
      title: 'Warning',
      width: 'small',
      inputs: {
        icon: 'warning'
      },
    }, config)
  },

  success: {
    component: FlexiModalBasicComponent,
    convert: (config: IFlexiModalBasicOptionsByTypes['success']) => extendModalOptions({
      title: 'Success',
      width: 'small',
      inputs: {
        icon: 'success'
      },
    }, config)
  },

  info: {
    component: FlexiModalBasicComponent,
    convert: (config: IFlexiModalBasicOptionsByTypes['info']) => extendModalOptions({
      title: 'Information',
      width: 'small',
      inputs: {
        icon: 'info'
      },
    }, config)
  },

  confirm: {
    component: FlexiModalBasicComponent,
    convert: (config: IFlexiModalBasicOptionsByTypes['confirm']) => {
      const options = extendModalOptions({
        title: 'Confirmation',
        closable: false,
        width: 'small',
        inputs: {
          icon: 'confirm'
        },
      }, config);

      options.actions = [
        {
          id: MODAL_YES_BUTTON_ID,
          label: config.onYesLabel || 'Confirm',
          onClick: config.onYes,
          primary: true,
        },
        {
          id: MODAL_NO_BUTTON_ID,
          label: config.onNoLabel || 'Cancel',
          onClick: config.onNo,
        }
      ];

      return options;
    }
  }
};
