import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { provideFlexiModals, withStyling } from '../../projects/ngx-flexi-modal/src/lib/flexi-modals.providers';
import { FmModalsOutletComponent } from '../../projects/ngx-flexi-modal/src/lib/components/modals-outlet/fm-modals-outlet.component';
import { FlexiModalsService } from '../../projects/ngx-flexi-modal/src/lib/services/modals/flexi-modals.service';
import { CySimpleTextComponent } from './modal-content/simple-text/cy-simple-text.component';

describe('FmModalsOutletComponent', () => {

  it('should be mount', () => {
    cy.mount('<fm-modals-outlet />', {
      imports: [
        FmModalsOutletComponent,
      ],
      providers: [
        provideNoopAnimations(),
        provideFlexiModals(
          withStyling({
            headerActions: 'outside',
          })
        ),
      ],
    });

    cy.inject(FlexiModalsService)
      .then((service: FlexiModalsService) => {
        const modal = service.showComponent(CySimpleTextComponent);

        expect(modal).to.be.ok;
      });
  });
});
