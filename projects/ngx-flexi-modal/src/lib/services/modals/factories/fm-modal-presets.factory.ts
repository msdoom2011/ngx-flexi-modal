import { inject, Injectable } from '@angular/core';

import { FmModalWithComponent } from '../../../models/fm-modal-with-component';
import { FLEXI_MODAL_PRESET_COLLECTION } from '../../../flexi-modals.tokens';
import { FmModalFactory } from './fm-modal.factory';
import {
  IFmModalPresets,
  IFmModalPresetConfig,
  IFmModalPresetOptionsByModalTypes,
} from '../flexi-modals.definitions';

@Injectable()
export class FmModalPresetsFactory extends FmModalFactory<FmModalWithComponent> {

  private readonly _presetCollections = inject<Array<IFmModalPresets<IFmModalPresetOptionsByModalTypes>>>(FLEXI_MODAL_PRESET_COLLECTION);

  private readonly _presets = <Record<keyof IFmModalPresetOptionsByModalTypes, IFmModalPresetConfig>>{};

  public constructor() {
    super();

    this._presets = <Record<keyof IFmModalPresetOptionsByModalTypes, IFmModalPresetConfig>>(
      this._presetCollections.reduce((result, extension) => ({...result, ...extension}), {})
    );
  }

  public test(subject: unknown): boolean {
    return !!(subject && typeof subject === 'string');
  }

  public create<
    ComponentT extends object,
    T extends keyof IFmModalPresetOptionsByModalTypes
  >(
    modalType: T,
    options: IFmModalPresetOptionsByModalTypes[T],
  ): FmModalWithComponent<ComponentT> | null {

    const modalTypeConfig = this._presets[modalType];

    if (!modalTypeConfig) {
      throw new Error(`Trying to instantiate modal of unregistered type "${String(modalType)}"`);
    }

    const factory = this.service.findFactory(modalTypeConfig.component);

    if (!factory) {
      return null;
    }

    return factory.create(
      modalTypeConfig.component,
      modalTypeConfig.convert(options),
    );
  }
}
