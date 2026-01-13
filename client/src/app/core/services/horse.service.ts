import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Horse } from '../../domain/models/horse.model';
import { CreateHorseRequest } from '../../domain/Dtos/create-horse.request';

@Injectable({
  providedIn: 'root',
})
export class HorseService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/Horse';

  getAllHorses(): Observable<Horse[]> {
    return this.http.get<Horse[]>(this.apiUrl);
  }

  createHorse(request: CreateHorseRequest): Observable<Horse> {
    return this.http.post<Horse>(this.apiUrl, request);
  }
}
