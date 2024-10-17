import { Component } from '@angular/core';

import {
  FmModalsOutletComponent
} from '../../../projects/ngx-flexi-modal/src/lib/components/modals-outlet/fm-modals-outlet.component';
import {
  FmModalHeaderTplDirective
} from '../../../projects/ngx-flexi-modal/src/lib/components/modals-outlet/directives/fm-modal-header-tpl.directive';

@Component({
  standalone: true,
  imports: [ FmModalsOutletComponent, FmModalHeaderTplDirective ],
  template: `
    <fm-modals-outlet>
      <ng-container *fmModalHeaderTpl="
        let title = $title;
        let theme = $theme;
        let data = $data;
        let modal = $modal
      ">
        <h3
          class="custom-title"
          data-cy="modal-title"
          [attr.data-theme]="theme"
        >{{ data.noTitle ? '' : title }}</h3>
      </ng-container>
    </fm-modals-outlet>
  `
})
export class OutletWithRedefinedHeaderComponent {}
