import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { HorsesComponent } from './horses.component';
import { HorseService } from '../../core/services/horse.service';
import { Sex } from '../../domain/enums/sex.enum';
import { Horse } from '../../domain/models/horse.model';

describe('HorsesComponent', () => {
    let component: HorsesComponent;
    let httpMock: HttpTestingController;

    const mockHorses: Horse[] = [
        { id: '1', name: 'Spirit', birthYear: 2020, height: 165, sex: Sex.Male, healthCertificate: '' },
        { id: '2', name: 'Luna', birthYear: 2019, height: 160, sex: Sex.Female, healthCertificate: 'cert.pdf' },
        { id: '3', name: 'Thunder', birthYear: 2021, height: 170, sex: Sex.Male, healthCertificate: '' },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HorsesComponent, HttpClientTestingModule],
            providers: [HorseService, provideRouter([])]
        }).compileComponents();

        const fixture = TestBed.createComponent(HorsesComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load horses on init', () => {
        const req = httpMock.expectOne('/api/Horse');
        expect(req.request.method).toBe('GET');
        req.flush(mockHorses);

        expect(component.horses().length).toBe(3);
        expect(component.isLoading()).toBe(false);
    });

    it('should calculate mares count correctly', () => {
        const req = httpMock.expectOne('/api/Horse');
        req.flush(mockHorses);

        expect(component.maresCount()).toBe(1);
    });

    it('should calculate stallions count correctly', () => {
        const req = httpMock.expectOne('/api/Horse');
        req.flush(mockHorses);

        expect(component.stallionsCount()).toBe(2);
    });

    it('should filter horses by mares', () => {
        const req = httpMock.expectOne('/api/Horse');
        req.flush(mockHorses);

        component.setFilter('mares');

        expect(component.filteredHorses().length).toBe(1);
        expect(component.filteredHorses()[0].name).toBe('Luna');
    });

    it('should filter horses by stallions', () => {
        const req = httpMock.expectOne('/api/Horse');
        req.flush(mockHorses);

        component.setFilter('stallions');

        expect(component.filteredHorses().length).toBe(2);
        expect(component.filteredHorses().map(h => h.name)).toContain('Spirit');
        expect(component.filteredHorses().map(h => h.name)).toContain('Thunder');
    });

    it('should show all horses when filter is "all"', () => {
        const req = httpMock.expectOne('/api/Horse');
        req.flush(mockHorses);

        component.setFilter('all');

        expect(component.filteredHorses().length).toBe(3);
    });

    it('should handle loading error', () => {
        const req = httpMock.expectOne('/api/Horse');
        req.error(new ErrorEvent('Network error'));

        expect(component.error()).toBeTruthy();
        expect(component.isLoading()).toBe(false);
    });

    it('should start with loading state', () => {
        expect(component.isLoading()).toBe(true);
        httpMock.expectOne('/api/Horse').flush([]);
    });

    it('should start with "all" filter active', () => {
        expect(component.activeFilter()).toBe('all');
        httpMock.expectOne('/api/Horse').flush([]);
    });
});
