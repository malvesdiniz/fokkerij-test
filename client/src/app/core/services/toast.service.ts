import { Injectable, signal } from '@angular/core';
import { Toast, ToastType } from '../../domain/models/toast.model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private counter = 0;
  readonly toasts = signal<Toast[]>([]);

  show(message: string, type: ToastType = 'info', duration = 4000): void {
    const id = ++this.counter;
    this.toasts.update((toasts) => [...toasts, { id, message, type }]);

    setTimeout(() => {
      this.dismiss(id);
    }, duration);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error', 5000);
  }

  dismiss(id: number): void {
    this.toasts.update((toasts) => toasts.filter((t) => t.id !== id));
  }
}
