import { Component, output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateHorseRequest } from '../../../../domain/Dtos/create-horse.request';
import { Sex } from '../../../../domain/enums/sex.enum';

@Component({
  selector: 'app-horse-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './horse-form.component.html',
  styleUrl: './horse-form.component.css',
})
export class HorseFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly formSubmit = output<CreateHorseRequest>();
  readonly isSubmitting = signal(false);
  readonly selectedFileName = signal<string | null>(null);

  readonly sexOptions = [
    { value: Sex.Male, label: 'Hengst' },
    { value: Sex.Female, label: 'Merrie' },
  ];

  readonly currentYear = new Date().getFullYear();

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    sex: ['', Validators.required],
    birthYear: [
      this.currentYear,
      [Validators.required, Validators.min(1900), Validators.max(this.currentYear)],
    ],
    height: ['', [Validators.required, Validators.min(50), Validators.max(250)]],
    healthCertificate: [''],
  });

  readonly yearOptions: number[] = Array.from({ length: 50 }, (_, i) => this.currentYear - i);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFileName.set(file.name);
      this.form.patchValue({ healthCertificate: file.name });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isSubmitting.set(true);
      const request: CreateHorseRequest = {
        name: this.form.value.name,
        birthYear: this.form.value.birthYear,
        height: this.form.value.height,
        sex: this.form.value.sex,
        healthCertificate: this.form.value.healthCertificate,
      };
      this.formSubmit.emit(request);
    } else {
      this.form.markAllAsTouched();
    }
  }

  resetSubmitting(): void {
    this.isSubmitting.set(false);
  }

  getFieldError(fieldName: string): string | null {
    const control = this.form.get(fieldName);
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'Dit veld is verplicht';
      if (control.errors['minlength'])
        return `Minimaal ${control.errors['minlength'].requiredLength} karakters`;
      if (control.errors['maxlength'])
        return `Maximaal ${control.errors['maxlength'].requiredLength} karakters`;
      if (control.errors['min']) return `Minimale waarde is ${control.errors['min'].min}`;
      if (control.errors['max']) return `Maximale waarde is ${control.errors['max'].max}`;
    }
    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return !!(control?.touched && control?.invalid);
  }
}
