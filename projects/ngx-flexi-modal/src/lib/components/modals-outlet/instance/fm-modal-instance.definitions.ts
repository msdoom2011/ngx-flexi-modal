import {AnimationMetadata} from '@angular/animations';

import {TFmModalOpeningAnimation} from '../../../services/modals/flexi-modals.definitions';

export interface IFmModalAnimationConfig {
  fallback: TFmModalOpeningAnimation;
  validate: (modalBodyElement: HTMLDivElement) => boolean;
  transition: () => Array<AnimationMetadata>;
}

export interface IFmHeightAdjustParams {
  height: string;
}

export interface IFmModalMaximizeAnimationParams {
  width: string;
  height: string;
  paddingTop: string;
  paddingBottom: string;
  paddingLeft: string;
  paddingRight: string;
  borderRadius: string;
  boxShadow: string;
}

export interface IFmModalMinimizeAnimationParams {
  alignItems: string;
  headerHeight: string;
}
