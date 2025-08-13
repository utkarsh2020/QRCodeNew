import { Directive, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';

@Directive({
  selector: '[appDebounce]',
  standalone: true
})
export class DebounceDirective implements OnInit, OnDestroy {
  @Input() debounceTime = 300;
  @Output() debounceChange = new EventEmitter<any>();

  private destroy$ = new Subject<void>();

  constructor(private ngControl: NgControl) {}

  ngOnInit(): void {
    if (this.ngControl?.control) {
      this.ngControl.control.valueChanges
        .pipe(
          debounceTime(this.debounceTime),
          takeUntil(this.destroy$)
        )
        .subscribe(value => {
          this.debounceChange.emit(value);
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}