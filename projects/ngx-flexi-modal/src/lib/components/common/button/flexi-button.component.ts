import {booleanAttribute, Component, input} from '@angular/core';

@Component({
  selector: '[fm-button]',
  standalone: true,
  imports: [],
  template: '<ng-content />',
  styleUrl: './flexi-button.component.scss',
  host: {
    '[class.primary]': 'isPrimary()'
  }
})
export class FlexiButtonComponent {

  public isPrimary = input<boolean, boolean | string>(false, {
    alias: 'fm-button-primary',
    transform: booleanAttribute
  });
}
