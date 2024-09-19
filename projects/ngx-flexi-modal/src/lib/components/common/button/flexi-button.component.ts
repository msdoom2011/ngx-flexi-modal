import {booleanAttribute, Component, input} from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
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
