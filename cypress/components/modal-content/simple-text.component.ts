import { Component } from '@angular/core';

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
export class SimpleTextComponent {

  static content = 'The simple text component works!';

  public content = SimpleTextComponent.content;
}
