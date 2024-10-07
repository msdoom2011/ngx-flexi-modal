import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'fm-round-dotted-spinner',
  standalone: true,
  imports: [],
  templateUrl: './fm-round-dotted-spinner.component.html',
  styleUrl: './fm-round-dotted-spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-cy': 'round-dotted-spinner',
  }
})
export class FmRoundDottedSpinnerComponent {}
