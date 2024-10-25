import { Component, input } from '@angular/core';

import { IFmModalAware } from '../../../projects/ngx-flexi-modal/src/lib/components/fm-modal.abstract';
import { FmModal } from '../../../projects/ngx-flexi-modal/src/lib/models/fm-modal';

@Component({
  selector: 'cy-many-text',
  standalone: true,
  template: `
    <div>
      @for (i of rows; track $index) {
        <p>The simple text component works!</p>
      }
    </div>
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
export class ManyTextComponent {

  public rows: Array<number> = new Array(30).fill(1);
}
