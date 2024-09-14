import {SurveyModalBasicComponent} from "./components/modal-basic/survey-modal-basic.component";
import {MODAL_NO_BUTTON_ID, MODAL_YES_BUTTON_ID} from "./survey-modal-basic.constants";
import {IModalBasicOptionsByTypes} from "./survey-modal-basic.models";
import {ISurveyModalExtension} from "../../survey-modals.models";
import {extendModalOptions} from "./survey-modal-basic.helpers";

export const modalBasicExtension: ISurveyModalExtension<IModalBasicOptionsByTypes> = {
  error: {
    component: SurveyModalBasicComponent,
    convert: (config: IModalBasicOptionsByTypes['error']) => extendModalOptions({
      title: 'Error',
      width: 'small',
      inputs: {
        icon: 'error'
      },
    }, config)
  },
  warning: {
    component: SurveyModalBasicComponent,
    convert: (config: IModalBasicOptionsByTypes['warning']) => extendModalOptions({
      title: 'Warning',
      width: 'small',
      inputs: {
        icon: 'warning'
      },
    }, config)
  },
  success: {
    component: SurveyModalBasicComponent,
    convert: (config: IModalBasicOptionsByTypes['success']) => extendModalOptions({
      title: 'Success',
      width: 'small',
      inputs: {
        icon: 'success'
      },
    }, config)
  },
  info: {
    component: SurveyModalBasicComponent,
    convert: (config: IModalBasicOptionsByTypes['info']) => extendModalOptions({
      title: 'Information',
      width: 'small',
      inputs: {
        icon: 'info'
      },
    }, config)
  },
  confirm: {
    component: SurveyModalBasicComponent,
    convert: (config: IModalBasicOptionsByTypes['confirm']) => {
      const options = extendModalOptions({
        title: 'Confirmation',
        closable: false,
        width: 'small',
        inputs: {
          icon: 'confirm'
        },
      }, config);

      options.buttons = [
        {
          id: MODAL_YES_BUTTON_ID,
          label: config.onYesLabel || 'Confirm',
          onClick: config.onYes,
        },
        {
          id: MODAL_NO_BUTTON_ID,
          label: config.onNoLabel || 'Cancel',
          onClick: config.onNo,
          theme: 'secondary',
        }
      ];

      return options;
    }
  }
};
