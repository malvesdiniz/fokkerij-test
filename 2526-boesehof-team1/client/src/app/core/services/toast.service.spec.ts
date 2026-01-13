import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService],
    });

    service = TestBed.inject(ToastService);
  });

  it('should add a toast when show is called', () => {
    service.show('Hello world');

    const toasts = service.toasts();
    expect(toasts.length).toBe(1);
    expect(toasts[0].message).toBe('Hello world');
    expect(toasts[0].type).toBe('info');
  });

  it('should add a success toast', () => {
    service.success('Saved successfully');

    const toast = service.toasts()[0];
    expect(toast.type).toBe('success');
  });

  it('should dismiss a toast manually', () => {
    service.show('Toast 1');
    service.show('Toast 2');

    const first = service.toasts()[0];
    service.dismiss(first.id);

    const remaining = service.toasts();
    expect(remaining.length).toBe(1);
    expect(remaining[0].message).toBe('Toast 2');
  });
});
