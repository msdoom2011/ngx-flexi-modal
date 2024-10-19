import {FmModalBasicComponent} from './components/modal-basic/fm-modal-basic.component';
import {FM_MODAL_NO_BUTTON_ID, FM_MODAL_YES_BUTTON_ID} from './fm-modal-basic.constants';
import {IFmModalBasicExtensionOptionsByModalTypes} from './fm-modal-basic.definitions';
import {IFmExtension} from '../../services/modals/flexi-modals.definitions';
import {extendBasicModalOptions} from './fm-modal-basic.helpers';

export const fmModalBasicExtension: IFmExtension<IFmModalBasicExtensionOptionsByModalTypes> = {

  error: {
    component: FmModalBasicComponent,
    options: {
      title: 'Error',
      width: 'tiny',
      inputs: {
        icon: 'error'
      },
    },
    convert(config: IFmModalBasicExtensionOptionsByModalTypes['error']) {
      return extendBasicModalOptions(this.options, config)
    }
  },

  warning: {
    component: FmModalBasicComponent,
    options: {
      title: 'Warning',
      width: 'tiny',
      inputs: {
        icon: 'warning'
      },
    },
    convert(config: IFmModalBasicExtensionOptionsByModalTypes['warning']) {
      return extendBasicModalOptions(this.options, config)
    }
  },

  success: {
    component: FmModalBasicComponent,
    options: {
      title: 'Success',
      width: 'tiny',
      inputs: {
        icon: 'success'
      },
    },
    convert(config: IFmModalBasicExtensionOptionsByModalTypes['success']) {
      return extendBasicModalOptions(this.options, config);
    }
  },

  info: {
    component: FmModalBasicComponent,
    options: {
      title: 'Information',
      width: 'tiny',
      inputs: {
        icon: 'info'
      },
    },
    convert(config: IFmModalBasicExtensionOptionsByModalTypes['info']) {
      return extendBasicModalOptions(this.options, config);
    }
  },

  confirm: {
    component: FmModalBasicComponent,
    options: {
      title: 'Confirmation',
      closable: false,
      width: 'tiny',
      inputs: {
        icon: 'confirm'
      },
    },
    convert(config: IFmModalBasicExtensionOptionsByModalTypes['confirm']) {
      const options = extendBasicModalOptions(this.options, config);

      options.actions = [
        {
          id: FM_MODAL_YES_BUTTON_ID,
          label: config.onYesLabel || 'Confirm',
          onClick: config.onYes,
          primary: true,
        },
        {
          id: FM_MODAL_NO_BUTTON_ID,
          label: config.onNoLabel || 'Cancel',
          onClick: config.onNo,
        }
      ];

      return options;
    }
  }
};
