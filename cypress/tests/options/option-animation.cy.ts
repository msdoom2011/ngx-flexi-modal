import { Type } from '@angular/core';

import { initializeServiceModals, initializeTemplateModals, showComponent } from '../../support/helpers/common-helpers';
import { ModalEmptyComponent } from '../../components/modals-templated/modals/modal-empty.component';
import { withDefaultOptions } from '../../../projects/ngx-flexi-modal/src/lib/flexi-modals.providers';
import { SimpleTextComponent } from '../../components/modal-content/simple-text.component';
import { ManyTextComponent } from '../../components/modal-content/many-text.component';
import {
  fmModalOptionsDefault
} from '../../../projects/ngx-flexi-modal/src/lib/services/modals/flexi-modals.constants';
import {
  TFmModalOpeningAnimation
} from '../../../projects/ngx-flexi-modal/src/lib/services/modals/flexi-modals.definitions';

describe('Option "animation"', () => {

  it('should has proper default animation (service)', () => {
    initializeServiceModals();
    showComponent(SimpleTextComponent);

    cy.getCy('modal-layout').should('have.attr', 'data-animation', fmModalOptionsDefault.animation);
  });

  it('should has proper default animation (template)', () => {
    initializeTemplateModals(ModalEmptyComponent, { inputs: { opened: true }});

    cy.getCy('modal-layout').should('have.attr', 'data-animation', fmModalOptionsDefault.animation);
  });

  it('should has proper redefined default animation (service)', () => {
    const animation = 'fade-in';

    initializeServiceModals(withDefaultOptions({ animation }));
    showComponent(SimpleTextComponent);

    cy.getCy('modal-layout').should('have.attr', 'data-animation', animation);
  });

  it('should has proper redefined default animation (templated)', () => {
    const animation = 'fade-in';

    initializeTemplateModals(ModalEmptyComponent, { inputs: { opened: true }}, withDefaultOptions({ animation }));

    cy.getCy('modal-layout').should('have.attr', 'data-animation', animation);
  });

  it('should display modal with configured animation (service)', () => {
    cy.viewport(500, 1100);

    const animations: Record<TFmModalOpeningAnimation, TFmModalOpeningAnimation> = {
      'fade-in': 'fade-in',
      'zoom-in': 'zoom-in',
      'zoom-out': 'zoom-out',
      'slide': 'slide',
      'appear': 'appear',
      'fall-down': 'fall-down',
      'roll-out': 'slide',
    };

    initializeServiceModals();

    for (const animation in animations) {
      if (!Object.hasOwnProperty.call(animations, animation)) {
        continue;
      }

      checkAnimation(
        SimpleTextComponent,
        <TFmModalOpeningAnimation>animation,
        <TFmModalOpeningAnimation>animation
      );
      checkAnimation(
        ManyTextComponent,
        <TFmModalOpeningAnimation>animation,
        animations[<TFmModalOpeningAnimation>animation]
      );
    }

    function checkAnimation(
      component: Type<any>,
      animationName: TFmModalOpeningAnimation,
      animationNameApplied: TFmModalOpeningAnimation
    ): void {
      showComponent(component, { animation: animationName });

      cy.getCy('modal-layout').should('have.attr', 'data-animation', animationNameApplied);
      cy.getCy('modal-close-btn').click();
      cy.getCy('modal').should('not.exist');
    }
  });

  it('should display modal with configured animation (templated)', () => {
    cy.viewport(500, 500);

    const animations: Array<TFmModalOpeningAnimation> = [
      'fade-in',
      'zoom-in',
      'zoom-out',
      'slide',
      'appear',
      'fall-down',
      'roll-out',
    ];

    initializeTemplateModals(ModalEmptyComponent);

    for (const animation of animations) {
      checkAnimation(animation);
    }

    function checkAnimation(animationName: TFmModalOpeningAnimation): void {
      cy.get('@fixture').then((fixture: any) => {
        fixture.componentRef.setInput('inputs', { animation: animationName, opened: true });
        fixture.detectChanges();
      });

      cy.getCy('modal-layout').should('have.attr', 'data-animation', animationName);
      cy.getCy('modal-close-btn').click();
      cy.getCy('modal').should('not.exist');

      cy.get('@fixture').then((fixture: any) => {
        fixture.componentRef.setInput('inputs', { opened: false });
        fixture.detectChanges();
      });
    }
  });
});
