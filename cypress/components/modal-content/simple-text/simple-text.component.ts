import { Component } from '@angular/core';

@Component({
  selector: 'cy-simple-text',
  templateUrl: './simple-text.component.html',
  styleUrl: './simple-text.component.scss',
  standalone: true,
})
export class SimpleTextComponent {

  static content = 'The simple text component works!';

  public content = SimpleTextComponent.content;
}
