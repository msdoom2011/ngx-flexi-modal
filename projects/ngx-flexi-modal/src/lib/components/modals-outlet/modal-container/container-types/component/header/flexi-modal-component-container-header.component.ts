import {ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
  selector: 'fm-modal-component-container-header',
  standalone: true,
  templateUrl: './flexi-modal-component-container-header.component.html',
  styleUrl: './flexi-modal-component-container-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlexiModalComponentContainerHeaderComponent {

  // Imports
  public title = input<string>();
}
