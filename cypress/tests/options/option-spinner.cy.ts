import { Provider } from '@angular/core';

import { initializeServiceModals, initializeTemplateModals, showComponent } from '../../support/helpers/common-helpers';
import { ModalSimpleTextComponent } from '../../components/modals-templated/modals/modal-simple-text.component';
import { SimpleTextComponent } from '../../components/modal-content/simple-text.component';
import { withDefaultOptions } from '../../../projects/ngx-flexi-modal/src/lib/flexi-modals.providers';
import {
  TFmModalSpinnerType
} from '../../../projects/ngx-flexi-modal/src/lib/services/modals/flexi-modals.definitions';
import {
  fmModalOptionsDefault
} from '../../../projects/ngx-flexi-modal/src/lib/services/modals/flexi-modals.constants';

describe('Option "spinner"', () => {
  const spinners = ['', 'round-dotted', 'round-dashed', 'linear-dotted', 'linear-dashed'];

  it('should be customized via default options (service)', () => {
    checkServiceModal('linear-dotted', withDefaultOptions({ spinner: 'linear-dotted' }));
  });

  it('should be customized via default options (templated)', () => {
    checkTemplatedModal('linear-dotted', withDefaultOptions({ spinner: 'linear-dotted' }));
  });

  for(const spinner of spinners) {
    const spinnerType = !spinner ? fmModalOptionsDefault.spinner : spinner;

    it(`should be set to the "${ spinner || 'default' }" (service)`, () => {
      checkServiceModal(<TFmModalSpinnerType>spinnerType);
    });

    it(`should be set to the "${ spinner || 'default' }" (templated)`, () => {
      checkTemplatedModal(<TFmModalSpinnerType>spinnerType);
    });
  }
});

function checkServiceModal(spinnerType: TFmModalSpinnerType, ...providers: Array<Provider>) {
  initializeServiceModals(...providers);

  showComponent(SimpleTextComponent, {
    spinner: spinnerType,
  })
    .then(modal => {
      cy.wrap(modal).as('modal');
      modal?.startLoading();
    });

  cy.getCy('modal-body').should('be.visible');
  checkSpinnerType(spinnerType);
}

function checkTemplatedModal(spinnerType: TFmModalSpinnerType, ...providers: Array<Provider>) {
  initializeTemplateModals(
    ModalSimpleTextComponent,
    {
      inputs: {
        spinner: spinnerType,
      },
    },
    ...providers,
  );

  cy.get('@modalComponent').then((modal: any) => {
    modal.open();
    modal.startLoading();
  });
  cy.getCy('modal-body').should('be.visible');

  checkSpinnerType(spinnerType);
}

function checkSpinnerType(spinnerType: TFmModalSpinnerType) {
  cy.getCy('modal-loader').should('be.visible');
  cy.getCy('modal-loader-spinner').should('have.class', 'spinner-type-' + spinnerType);
}
