import { initializeServiceModals, showComponent } from '../../support/helpers/common-helpers';
import { ManyTextComponent } from '../../components/modal-content/many-text.component';

describe('Option "scroll"', () => {

  it('should correspond to the default value (service)', () => {
    initializeServiceModals();
    showComponent(ManyTextComponent);


  });

  it('should correspond to the default value (template)', () => {

  });

  it('should correspond to redefined default value (service)', () => {

  });

  it('should correspond to redefined default value (template)', () => {

  });

  it('should be configurable (service)', () => {

  });

  it('should be configurable (template)', () => {

  });
});
