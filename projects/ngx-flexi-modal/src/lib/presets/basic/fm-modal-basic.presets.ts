import {FmModalBasicComponent} from './components/modal-basic/fm-modal-basic.component';
import {FM_MODAL_NO_BUTTON_ID, FM_MODAL_YES_BUTTON_ID} from './fm-modal-basic.constants';
import {IFmModalBasicPresetsOptionsByModalTypes} from './fm-modal-basic.definitions';
import {IFmModalPresets} from '../../services/modals/flexi-modals.definitions';
import {extendBasicModalOptions} from './fm-modal-basic.helpers';

export const fmModalBasicPresets: IFmModalPresets<IFmModalBasicPresetsOptionsByModalTypes> = {

  error: {
    component: FmModalBasicComponent,
    options: {
      title: 'Error',
      width: 'xs',
      inputs: {
        icon: 'error'
      },
    },
    convert(config: IFmModalBasicPresetsOptionsByModalTypes['error']) {
      return extendBasicModalOptions(this.options, config)
    }
  },

  warning: {
    component: FmModalBasicComponent,
    options: {
      title: 'Warning',
      width: 'xs',
      inputs: {
        icon: 'warning'
      },
    },
    convert(config: IFmModalBasicPresetsOptionsByModalTypes['warning']) {
      return extendBasicModalOptions(this.options, config)
    }
  },

  success: {
    component: FmModalBasicComponent,
    options: {
      title: 'Success',
      width: 'xs',
      inputs: {
        icon: 'success'
      },
    },
    convert(config: IFmModalBasicPresetsOptionsByModalTypes['success']) {
      return extendBasicModalOptions(this.options, config);
    }
  },

  info: {
    component: FmModalBasicComponent,
    options: {
      title: 'Information',
      width: 'xs',
      inputs: {
        icon: 'info'
      },
    },
    convert(config: IFmModalBasicPresetsOptionsByModalTypes['info']) {
      return extendBasicModalOptions(this.options, config);
    }
  },

  confirm: {
    component: FmModalBasicComponent,
    options: {
      title: 'Confirmation',
      closable: false,
      width: 'xs',
      inputs: {
        icon: 'confirm'
      },
    },
    convert(config: IFmModalBasicPresetsOptionsByModalTypes['confirm']) {
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
