import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  DoCheck,
  effect,
  ElementRef,
  inject,
  input,
  model,
  OnChanges,
  OnDestroy,
  output,
  signal,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { filter, Subject, takeUntil } from 'rxjs';

import { FmModalBeforeCloseEvent } from '../../services/modals/events/fm-modal-before-close.event';
import { FlexiModalsThemeService } from '../../services/theme/flexi-modals-theme.service';
import { FmModalUpdateEvent } from '../../services/modals/events/fm-modal-update.event';
import { FmModalCloseEvent } from '../../services/modals/events/fm-modal-close.event';
import { FmModalOpenEvent } from '../../services/modals/events/fm-modal-open.event';
import { FmModalActionDirective } from './directives/fm-modal-action.directive';
import { FmModalHeaderDirective } from './directives/fm-modal-header.directive';
import { FmModalFooterDirective } from './directives/fm-modal-footer.directive';
import { FlexiModalsService } from '../../services/modals/flexi-modals.service';
import { FmModalBodyDirective } from './directives/fm-modal-body.directive';
import { FmModalWithTemplate } from '../../models/fm-modal-with-template';
import {
  IFmModalWithTemplateConfig,
  IFmModalWithTemplateOptions,
  TFmModalHeight,
  TFmModalOpeningAnimation,
  TFmModalPosition,
  TFmModalScroll,
  TFmModalWidth,
} from '../../services/modals/flexi-modals.definitions';

@Component({
  selector: 'fm-modal',
  standalone: true,
  imports: [],
  template: '',
  styleUrl: './fm-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FmModalComponent implements DoCheck, OnChanges, AfterContentInit, OnDestroy {

  // Dependencies
  public readonly service = inject(FlexiModalsService);
  public readonly themes = inject(FlexiModalsThemeService);
  private readonly _elementRef = inject(ElementRef);

  // Inputs
  public readonly _id = input<string | undefined>(undefined, { alias: 'id' });
  public readonly _opened = model<boolean>(false, { alias: 'opened' });
  public readonly _maximized = model<boolean | undefined>(undefined, { alias: 'maximized' });
  public readonly _title = input<string | undefined>(undefined, { alias: 'title' });
  public readonly _animation = input<TFmModalOpeningAnimation | undefined>(undefined, { alias: 'animation' });
  public readonly _position = input<TFmModalPosition | undefined>(undefined, { alias: 'position' });
  public readonly _width = input<TFmModalWidth | undefined>(undefined, { alias: 'width' });
  public readonly _height = input<TFmModalHeight | undefined>(undefined, { alias: 'height' });
  public readonly _scroll = input<TFmModalScroll | undefined>(undefined, { alias: 'scroll' });
  public readonly _rounding = input<number | boolean | undefined>(undefined, { alias: 'rounding' });
  public readonly _closable = input<boolean | undefined>(undefined, { alias: 'closable' });
  public readonly _maximizable = input<boolean | undefined>(undefined, { alias: 'maximizable' });
  public readonly _data = input<Record<string, unknown> | undefined>(undefined, { alias: 'data' });

  // Outputs
  public readonly _changeEvent = output<FmModalUpdateEvent>({ alias: 'change' });
  public readonly _openEvent = output<FmModalOpenEvent>({ alias: 'open' });
  public readonly _closeEvent = output<FmModalCloseEvent>({ alias: 'close' });
  public readonly _beforeCloseEvent = output<FmModalBeforeCloseEvent>({ alias: 'beforeClose' });

  // Signals
  public readonly modal = signal<FmModalWithTemplate | null>(null);
  private readonly _classes = signal<Array<string> | undefined>(undefined);
  private readonly _classesChanged = signal<boolean>(false);

  // Queries
  private readonly _actionsRef = contentChildren(FmModalActionDirective, { descendants: true });
  private readonly _headerRef = contentChild(FmModalHeaderDirective);
  private readonly _footerRef = contentChild(FmModalFooterDirective);
  private readonly _bodyRef = contentChild(FmModalBodyDirective);

  // Private props
  private readonly _destroy$ = new Subject<void>();


  // Computed

  public readonly id = computed<string>(() => {
    return this.modal()?.id() || '';
  });

  public readonly opened = computed<boolean>(() => {
    return this._opened();
  });

  public readonly maximized = computed<boolean>(() => {
    return !!this.modal()?.config().maximized;
  });

  public readonly loading = computed<boolean>(() => {
    return !!this.modal()?.loading();
  });

  private readonly _bodyTpl = computed<TemplateRef<any> | undefined>(() => {
    return this._bodyRef()?.templateRef;
  });

  private readonly _headerTpl = computed<TemplateRef<any> | undefined>(() => {
    return this._headerRef()?.templateRef;
  });

  private readonly _footerTpl = computed<TemplateRef<any> | undefined>(() => {
    return this._footerRef()?.templateRef;
  });

  private readonly _actionsTpl = computed<Array<FmModalActionDirective> | undefined>(() => {
    return this._actionsRef()?.length
      ? [...this._actionsRef()]
      : undefined;
  });


  // Effects

  private readonly _modalChangeEffect = effect((onCleanup) => {
    if (!this.modal()) {
      return;
    }

    const subscription = this.service.events$
      .pipe(
        filter($event => $event.id === this.id()),
        takeUntil(this._destroy$)
      )
      .subscribe($event => {
        if ($event instanceof FmModalOpenEvent) {
          this._openEvent.emit($event);

        } else if ($event instanceof FmModalBeforeCloseEvent) {
          this._beforeCloseEvent.emit($event);

        } else if ($event instanceof FmModalCloseEvent) {
          this._opened.set(false);
          this.modal.set(null);

          this._closeEvent.emit($event);

        } else if ($event instanceof FmModalUpdateEvent) {
          this._changeEvent.emit(<FmModalUpdateEvent>$event);
        }
      });

    return onCleanup(() => {
      subscription.unsubscribe();
    });
  });

  private readonly _classesChangeEffect = effect(() => {
    if (!this._classesChanged()) {
      return;
    }

    this._classesChanged.set(false);
    this.service.updateModal(this.id(), {
      classes: this._classes(),
    });
  }, {
    allowSignalWrites: true,
  });


  // Lifecycle Hooks

  public ngDoCheck(): void {
    const classesStrNew = this._elementRef.nativeElement.className.replace(/\s+/g, ' ');
    const classesStrOld = (this._classes() || []).join(' ');
    const classes = classesStrNew.split(' ');

    if (classesStrNew !== classesStrOld) {
      this._classesChanged.set(true);
      this._classes.set(classes.length ? classes : undefined);
    }

    // Clean up the id attribute of the host element to prevent
    // it duplication in addition to appropriate rendered modal component instance
    this._elementRef.nativeElement.removeAttribute('id');
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const { _opened } = changes;

    if (!_opened?.currentValue) {
      return;

    } else if (!this.modal()) {
      this.open();

      return;
    }

    const options: IFmModalWithTemplateOptions<any> = {};
    const optionNames: Array<
      keyof IFmModalWithTemplateConfig<any>
      | { [inputName: string]: keyof IFmModalWithTemplateConfig<any> }
    > = [
      { _maximized: 'maximized' },
      { _title: 'title' },
      { _animation: 'animation' },
      { _position: 'position' },
      { _width: 'width' },
      { _height: 'height' },
      { _scroll: 'scroll' },
      { _closable: 'closable' },
      { _maximizable: 'maximizable' },
      { _data: 'data' },
    ];

    for (const item of optionNames) {
      const inputName = typeof item === 'object' ? Object.keys(item)[0] : item;
      const optionName = typeof item === 'object' ? item[inputName] : item;

      if (changes[inputName]) {
        options[optionName] = changes[inputName].currentValue;
      }
    }

    if (Object.keys(options).length > 0) {
      this.service.updateModal(this.id(), options);
    }
  }

  public ngAfterContentInit(): void {
    if (this._opened()) {
      this.open();
    }
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }


  // Public methods

  public open(): void {
    const bodyTpl = this._bodyTpl();

    if (this.modal() || !bodyTpl) {
      return;
    }

    this._validateInputs();

    const modal = this.service.showTemplate(bodyTpl, {
      id: this._id(),
      title: this._title(),
      animation: this._animation(),
      position: this._position(),
      width: this._width(),
      height: this._height(),
      scroll: this._scroll(),
      maximized: this._maximized(),
      closable: this._closable(),
      maximizable: this._maximizable(),
      aliveUntil: this._destroy$,
      headerTpl: this._headerTpl(),
      footerTpl: this._footerTpl(),
      actionsTpl: this._actionsTpl(),
      classes: this._classes(),
      data: this._data(),
    });

    if (modal) {
      this.modal.set(modal);

      modal.content$
        .pipe(filter(Boolean))
        .subscribe(() => this._opened.set(true));
    }
  }

  public close(): void {
    if (this._opened()) {
      this.service.closeModal(this.id());
    }
  }

  public maximize(): void {
    this.modal()?.maximize();
  }

  public minimize(): void {
    this.modal()?.minimize();
  }

  public toggleMaximize(): void {
    this.modal()?.toggleMaximize();
  }

  public startLoading(animation: boolean = true): void {
    this.modal()?.startLoading(animation);
  }

  public stopLoading(animation: boolean = true): void {
    this.modal()?.stopLoading(animation);
  }


  // Internal implementation

  private _validateInputs(): void {
    if (this._title() && this._headerTpl()) {
      console.warn(
        'Specified both "*fmModalHeader" directive and the "title" property value ' +
        'at the same time for the displaying modal. ' +
        'The "*fmModalHeader" directive content takes precedence over the "title" property, ' +
        'so the "title" bound value was ignored.'
      );
    }
  }
}
