import { mount } from 'cypress/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideFlexiModals } from 'ngx-flexi-modal';

import { AppTestComponent } from '../app/app-test.component';

describe('Modal with component', () => {

  beforeEach(() => {
    mount(AppTestComponent, {
      imports: [
        BrowserAnimationsModule,
      ],
      providers: [
        provideFlexiModals(),
      ]
    });
  });

  it.only('Opens with default options', () => {
    expect(true).to.equal(true);
  });
});
