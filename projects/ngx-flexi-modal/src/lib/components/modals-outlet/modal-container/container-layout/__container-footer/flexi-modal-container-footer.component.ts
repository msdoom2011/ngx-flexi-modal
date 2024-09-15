// import {ChangeDetectionStrategy, Component, input, TemplateRef} from '@angular/core';
// import {NgTemplateOutlet} from "@angular/common";
//
// import {FlexiModalButtonDirective} from "../../../../../directives/flexi-modal-button/flexi-modal-button.directive";
// import {IFlexiModalButtonConfig} from "../../../../../flexi-modals.models";
// import {FlexiModalContainer} from "../../flexi-modal-container";
// import {FlexiModalButton} from "../../../../../modals/buttons/flexi-modal-button";
//
// @Component({
//   selector: 'fm-modal-container-footer',
//   standalone: true,
//   imports: [
//     NgTemplateOutlet
//   ],
//   templateUrl: './flexi-modal-container-footer.component.html',
//   styleUrl: './flexi-modal-container-footer.component.scss',
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class FlexiModalContainerFooterComponent {
//
//   // Inputs
//   public modal = input.required<FlexiModalContainer<any, any>>();
//   public contentTpl = input<TemplateRef<any>>();
//   public buttons = input<Array<IFlexiModalButtonConfig>>();
//   public buttonsTpl = input<Array<FlexiModalButtonDirective>>();
//
//   // Callbacks
//
//   public onButtonClick($event: MouseEvent, buttonConfig: IFlexiModalButtonConfig): void {
//     const modal = this.modal();
//
//     if (!!buttonConfig.onClick) {
//       buttonConfig.onClick($event, new FlexiModalButton(modal, buttonConfig));
//     }
//
//     if (buttonConfig.closeOnClick) {
//       modal.close();
//     }
//   }
//
//   public onButtonTplClick(closeOnClick: any): void {
//     if (closeOnClick) {
//       this.modal().close();
//     }
//   }
//
//   // Methods
//
//   public getButtonClasses(buttonConfig: IFlexiModalButtonConfig): Array<string> {
//     return [
//       'fm-modal-button',
//       'button-position-' + buttonConfig.position,
//       'button-theme-' + buttonConfig.theme,
//       buttonConfig.disabled ? 'disabled' : '',
//       ...(buttonConfig.classes || []),
//     ]
//       .filter(Boolean);
//   }
// }
