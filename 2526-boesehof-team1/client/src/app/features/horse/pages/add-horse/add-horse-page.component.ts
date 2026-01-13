import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HorseFormComponent } from '../../components/horse-form/horse-form.component';
import { HorseService } from '../../../../core/services/horse.service';
import { CreateHorseRequest } from '../../../../domain/Dtos/create-horse.request';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-add-horse',
  standalone: true,
  imports: [HorseFormComponent, CommonModule],
  templateUrl: './add-horse-page.component.html',
  styleUrl: './add-horse-page.component.css',
})
export class AddHorsePageComponent {
  private readonly horseService = inject(HorseService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  @ViewChild(HorseFormComponent) horseForm!: HorseFormComponent;

  onBack(): void {
    window.history.back();
  }

  onFormSubmit(request: CreateHorseRequest): void {
    this.horseService.createHorse(request).subscribe({
      next: (horse) => {
        console.log('Horse created:', horse);
        this.toast.success('Paard succesvol opgeslagen!');
        this.horseForm?.resetSubmitting();
        this.horseForm?.form.reset();
      },
      error: (err) => {
        console.error('Error creating horse:', err);
        this.toast.error('Er is een fout opgetreden. Probeer het opnieuw.');
        this.horseForm?.resetSubmitting();
      },
    });
  }
}
