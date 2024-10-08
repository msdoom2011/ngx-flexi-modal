import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'fm-linear-dotted-spinner',
  standalone: true,
  imports: [],
  templateUrl: './fm-linear-dotted-spinner.component.html',
  styleUrl: './fm-linear-dotted-spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-cy': 'linear-dotted-spinner',
  }
})
export class FmLinearDottedSpinnerComponent {}
