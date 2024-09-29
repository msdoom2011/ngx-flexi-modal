import {AnimationMetadata} from "@angular/animations";

import {TFlexiModalOpeningAnimation} from "../../../../services/modals/flexi-modals.definitions";

export interface IFlexiModalAnimationConfig {
  fallback: TFlexiModalOpeningAnimation;
  validate: (modalBodyElement: HTMLDivElement) => boolean;
  transition: () => Array<AnimationMetadata>;
}

export interface IFlexiModalMaximizeAnimationParams {
  width: string;
  height: string;
  paddingTop: string;
  paddingBottom: string;
  paddingLeft: string;
  paddingRight: string;
  borderRadius: string;
}

export interface IFlexiModalMinimizeAnimationParams {
  alignItems: string;
}
