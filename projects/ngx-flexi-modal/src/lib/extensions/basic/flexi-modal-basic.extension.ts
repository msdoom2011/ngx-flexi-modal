import {FlexiModalBasicComponent} from "./components/modal-basic/flexi-modal-basic.component";
import {MODAL_NO_BUTTON_ID, MODAL_YES_BUTTON_ID} from "./flexi-modal-basic.constants";
import {IFlexiModalExtension} from "../../services/modals/flexi-modals.definitions";
import {IFlexiModalBasicOptionsByTypes} from "./flexi-modal-basic.definitions";
import {extendModalOptions} from "./flexi-modal-basic.helpers";

export const flexiModalBasicExtension: IFlexiModalExtension<IFlexiModalBasicOptionsByTypes> = {

  error: {
    component: FlexiModalBasicComponent,
    options: {
      title: 'Error',
      width: 'small',
      inputs: {
        icon: 'error'
      },
    },
    convert(config: IFlexiModalBasicOptionsByTypes['error']) {
      return extendModalOptions(this.options, config)
    }
  },

  warning: {
    component: FlexiModalBasicComponent,
    options: {
      title: 'Warning',
      width: 'small',
      inputs: {
        icon: 'warning'
      },
    },
    convert(config: IFlexiModalBasicOptionsByTypes['warning']) {
      return extendModalOptions(this.options, config)
    }
  },

  success: {
    component: FlexiModalBasicComponent,
    options: {
      title: 'Success',
      width: 'small',
      inputs: {
        icon: 'success'
      },
    },
    convert(config: IFlexiModalBasicOptionsByTypes['success']) {
      return extendModalOptions(this.options, config);
    }
  },

  info: {
    component: FlexiModalBasicComponent,
    options: {
      title: 'Information',
      width: 'small',
      inputs: {
        icon: 'info'
      },
    },
    convert(config: IFlexiModalBasicOptionsByTypes['info']) {
      return extendModalOptions(this.options, config);
    }
  },

  confirm: {
    component: FlexiModalBasicComponent,
    options: {
      title: 'Confirmation',
      closable: false,
      width: 'small',
      inputs: {
        icon: 'confirm'
      },
    },
    convert(config: IFlexiModalBasicOptionsByTypes['confirm']) {
      const options = extendModalOptions(this.options, config);

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
