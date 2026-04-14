import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { UiActions } from '@core/store/ui/ui.actions';
import { ToastMessage } from '@core/store/ui/ui.reducers';
import { selectToasts } from '@core/store/ui/ui.selectors';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toast.component',
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent implements OnInit {
  private store = inject(Store);
  toasts$!: Observable<ToastMessage[]>;

  ngOnInit(): void {
    this.toasts$ = this.store.select(selectToasts);
  }

  dismiss(id: number): void {
    this.store.dispatch(UiActions.dismissToast({ id }));
  }
}
