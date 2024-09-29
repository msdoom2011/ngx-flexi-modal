import {Component} from "@angular/core";
import {FlexiModalBasicComponent} from "ngx-flexi-modal";

@Component({
  selector: "fm-modal-basic-custom",
  templateUrl: './modal-basic-custom.component.html',
  styleUrl: './modal-basic-custom.component.scss',
  standalone: true,
})
export class ModalBasicCustomComponent extends FlexiModalBasicComponent {}