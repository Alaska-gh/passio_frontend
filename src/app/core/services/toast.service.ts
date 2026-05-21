import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private nextId = 0;

  show(message: string, type: ToastType = 'info', duration = 3500): void {
    const toast: Toast = { id: this.nextId++, message, type };
    this.toasts.update((ts) => [...ts, toast]);
    setTimeout(() => this.dismiss(toast.id), duration);
  }

  success(message: string): void {
    this.show(message, 'success');
  }
  error(message: string): void {
    this.show(message, 'error', 5000);
  }
  info(message: string): void {
    this.show(message, 'info');
  }

  dismiss(id: number): void {
    this.toasts.update((ts) => ts.filter((t) => t.id !== id));
  }
}
