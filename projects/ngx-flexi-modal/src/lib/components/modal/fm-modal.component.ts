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
  SimpleChange,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { filter, Subject, takeUntil } from 'rxjs';

import { FmModalBeforeCloseEvent } from '../../services/modals/events/fm-modal-before-close.event';
import { FmModalBeforeOpenEvent } from '../../services/modals/events/fm-modal-before-open.event';
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
  TFmModalSpinnerType,
  TFmModalWidth,
} from '../../services/modals/flexi-modals.definitions';
import { FmModal } from '../../models/fm-modal';

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
  public readonly _id = input<string | undefined>(FmModal.generateId(), { alias: 'id' });
  public readonly _opened = model<boolean>(false, { alias: 'opened' });
  public readonly _maximized = model<boolean | undefined>(undefined, { alias: 'maximized' });
  public readonly _title = input<string | undefined>(undefined, { alias: 'title' });
  public readonly _animation = input<TFmModalOpeningAnimation | undefined>(undefined, { alias: 'animation' });
  public readonly _position = input<TFmModalPosition | undefined>(undefined, { alias: 'position' });
  public readonly _width = input<TFmModalWidth | undefined>(undefined, { alias: 'width' });
  public readonly _height = input<TFmModalHeight | undefined>(undefined, { alias: 'height' });
  public readonly _scroll = input<TFmModalScroll | undefined>(undefined, { alias: 'scroll' });
  public readonly _spinner = input<TFmModalSpinnerType | undefined>(undefined, { alias: 'spinner' });
  public readonly _closable = input<boolean | undefined>(undefined, { alias: 'closable' });
  public readonly _maximizable = input<boolean | undefined>(undefined, { alias: 'maximizable' });
  public readonly _theme = input<string | undefined>(undefined, { alias: 'theme' });
  public readonly _data = input<Record<string, unknown> | undefined>(undefined, { alias: 'data' });

  // Outputs
  public readonly _changeEvent = output<FmModalUpdateEvent>({ alias: 'change' });
  public readonly _beforeOpenEvent = output<FmModalBeforeOpenEvent>({ alias: 'beforeOpen' });
  public readonly _openEvent = output<FmModalOpenEvent>({ alias: 'open' });
  public readonly _beforeCloseEvent = output<FmModalBeforeCloseEvent>({ alias: 'beforeClose' });
  public readonly _closeEvent = output<FmModalCloseEvent>({ alias: 'close' });

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
    return this.modal()?.id() || this._id() || '';
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

  private readonly _classesChangeEffect = effect(() => {
    if (!this._classesChanged()) {
      return;
    }

    this.service.update(this.id(), { classes: this._classes() });
    this._classesChanged.set(false);
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

    _opened
      ? this._handleOpenedChange(_opened)
      : this._handleOptionsChange(changes);
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

    this._listenModalEvents();

    const modal = this.service.show(bodyTpl, {
      id: this._id(),
      title: this._title(),
      animation: this._animation(),
      position: this._position(),
      width: this._width(),
      height: this._height(),
      scroll: this._scroll(),
      spinner: this._spinner(),
      maximized: this._maximized(),
      closable: this._closable(),
      maximizable: this._maximizable(),
      openUntil: this._destroy$,
      headerTpl: this._headerTpl(),
      footerTpl: this._footerTpl(),
      actionsTpl: this._actionsTpl(),
      classes: this._classes(),
      theme: this._theme(),
      data: this._data(),
    });

    if (modal) {
      this._opened.set(true);
      this.modal.set(modal);
    }
  }

  public close(): void {
    this.service.close(this.id());
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


  // Private methods

  private _listenModalEvents(): void {
    const subscription = this.service.events$
      .pipe(
        filter($event => $event.id === this.id()),
        takeUntil(this._destroy$)
      )
      .subscribe($event => {
        if ($event instanceof FmModalUpdateEvent) {
          this._changeEvent.emit(<FmModalUpdateEvent>$event);

        } else if ($event instanceof FmModalBeforeOpenEvent) {
          this._beforeOpenEvent.emit($event);

        } else if ($event instanceof FmModalOpenEvent) {
          this._openEvent.emit($event);

        } else if ($event instanceof FmModalBeforeCloseEvent) {
          this._beforeCloseEvent.emit($event);

        } else if ($event instanceof FmModalCloseEvent) {
          subscription.unsubscribe();

          this._opened.set(false);
          this.modal.set(null);

          this._closeEvent.emit($event);
        }
      });
  }

  private _handleOpenedChange(opened: SimpleChange): void {
    if (!opened) {
      return;
    }

    if (!opened.currentValue) {
      if (this.modal()) {
        this.close();
      }
    } else if (!this.modal()) {
      this.open();
    }
  }

  private _handleOptionsChange(changes: SimpleChanges): void {
    const options: IFmModalWithTemplateOptions = {};
    const optionNames: Array<
      keyof IFmModalWithTemplateConfig
      | { [inputName: string]: keyof IFmModalWithTemplateConfig }
    > = [
      { _maximized: 'maximized' },
      { _title: 'title' },
      { _animation: 'animation' },
      { _position: 'position' },
      { _width: 'width' },
      { _height: 'height' },
      { _scroll: 'scroll' },
      { _spinner: 'spinner' },
      { _closable: 'closable' },
      { _maximizable: 'maximizable' },
      { _theme: 'theme' },
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
      this.service.update(this.id(), options);
    }
  }
}
