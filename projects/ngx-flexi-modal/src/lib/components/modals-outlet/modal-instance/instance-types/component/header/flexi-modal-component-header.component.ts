import {ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
  selector: 'fm-modal-component-header',
  standalone: true,
  templateUrl: './flexi-modal-component-header.component.html',
  styleUrl: './flexi-modal-component-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlexiModalComponentHeaderComponent {

  // Imports
  public title = input<string>();
}
