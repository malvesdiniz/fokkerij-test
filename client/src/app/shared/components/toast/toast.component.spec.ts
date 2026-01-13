import { describe, it, expect, beforeEach } from 'vitest';
import { ToastService } from '../../../core/services/toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    service = new ToastService();
  });

  it('should start with empty toasts', () => {
    expect(service.toasts()).toEqual([]);
  });

  it('should add a toast when show is called', () => {
    service.show('Test message', 'info');

    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].message).toBe('Test message');
    expect(service.toasts()[0].type).toBe('info');
  });

  it('should add success toast', () => {
    service.success('Success!');

    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].type).toBe('success');
  });

  it('should add error toast', () => {
    service.error('Error!');

    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].type).toBe('error');
  });

  it('should dismiss toast by id', () => {
    service.show('Message 1', 'info');
    service.show('Message 2', 'info');

    const firstToastId = service.toasts()[0].id;
    service.dismiss(firstToastId);

    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].message).toBe('Message 2');
  });

  it('should assign unique ids to toasts', () => {
    service.show('Message 1', 'info');
    service.show('Message 2', 'info');

    const ids = service.toasts().map((t) => t.id);
    expect(ids[0]).not.toBe(ids[1]);
  });
});
