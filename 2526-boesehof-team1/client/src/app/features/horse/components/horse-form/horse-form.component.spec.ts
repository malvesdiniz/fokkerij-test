import { TestBed } from '@angular/core/testing';
import { HorseFormComponent } from './horse-form.component';
import { Sex } from '../../../../domain/enums/sex.enum';

describe('HorseFormComponent (Integration)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorseFormComponent],
    }).compileComponents();
  });

  it('should emit formSubmit when form is valid', () => {
    const fixture = TestBed.createComponent(HorseFormComponent);
    const component = fixture.componentInstance;

    spyOn(component.formSubmit, 'emit');

    component.form.setValue({
      name: 'Bella',
      sex: Sex.Female,
      birthYear: 2020,
      height: 160,
      healthCertificate: 'CERT-001',
    });

    component.onSubmit();

    expect(component.formSubmit.emit).toHaveBeenCalledWith({
      name: 'Bella',
      sex: Sex.Female,
      birthYear: 2020,
      height: 160,
      healthCertificate: 'CERT-001',
    });
  });

  it('should not emit when form is invalid', () => {
    const fixture = TestBed.createComponent(HorseFormComponent);
    const component = fixture.componentInstance;

    spyOn(component.formSubmit, 'emit');

    component.form.patchValue({
      name: '',
    });

    component.onSubmit();

    expect(component.formSubmit.emit).not.toHaveBeenCalled();
  });
});
