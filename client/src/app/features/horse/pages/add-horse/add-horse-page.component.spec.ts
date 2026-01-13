import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AddHorsePageComponent } from './add-horse-page.component';
import { HorseService } from '../../../../core/services/horse.service';
import { CreateHorseRequest } from '../../../../domain/Dtos/create-horse.request';
import { ToastService } from '../../../../core/services/toast.service';

describe('AddHorsePageComponent (Integration)', () => {
  let horseService: jasmine.SpyObj<HorseService>;
  let toastService: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    horseService = jasmine.createSpyObj('HorseService', ['createHorse']);
    toastService = jasmine.createSpyObj('ToastService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [AddHorsePageComponent],
      providers: [
        { provide: HorseService, useValue: horseService },
        { provide: ToastService, useValue: toastService },
      ],
    }).compileComponents();
  });

  it('should call service and show success toast on success', () => {
    const fixture = TestBed.createComponent(AddHorsePageComponent);
    const component = fixture.componentInstance;

    const request: CreateHorseRequest = {
      name: 'Bella',
      sex: 'Female' as any,
      birthYear: 2020,
      height: 160,
      healthCertificate: 'CERT',
    };

    horseService.createHorse.and.returnValue(of({ id: '1', ...request }));

    component.onFormSubmit(request);

    expect(horseService.createHorse).toHaveBeenCalledWith(request);
    expect(toastService.success).toHaveBeenCalledWith('Paard succesvol opgeslagen!');
  });

  it('should show error toast when service fails', () => {
    const fixture = TestBed.createComponent(AddHorsePageComponent);
    const component = fixture.componentInstance;

    const request = {} as CreateHorseRequest;

    horseService.createHorse.and.returnValue(throwError(() => new Error()));

    component.onFormSubmit(request);

    expect(toastService.error).toHaveBeenCalledWith(
      'Er is een fout opgetreden. Probeer het opnieuw.'
    );
  });
});
