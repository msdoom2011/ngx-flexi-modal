import { Component, input } from '@angular/core';

import { IFmModalAware } from '../../../projects/ngx-flexi-modal/src/lib/components/fm-modal.abstract';
import { FmModal } from '../../../projects/ngx-flexi-modal/src/lib/models/fm-modal';

@Component({
  selector: 'cy-simple-text',
  standalone: true,
  template: `
    <div>{{ content }}</div>
  `,
  styles: `
    :host {
      display: flex;
      width: 100%;
      min-height: 100px;
      align-items: center;
      justify-content: center;
    }
  `
})
export class SimpleTextComponent implements IFmModalAware {

  static content = 'The simple text component works!';

  public content = SimpleTextComponent.content;

  // @TODO implementation of IFmModalAware MUST be optional!!!!
  public modal = input<FmModal | null>();
}
