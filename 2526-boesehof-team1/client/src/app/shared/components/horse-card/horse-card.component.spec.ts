import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HorseCardComponent } from './horse-card.component';
import { Sex } from '../../../domain/enums/sex.enum';
import { Horse } from '../../../domain/models/horse.model';

describe('HorseCardComponent', () => {
    let component: HorseCardComponent;
    let fixture: ComponentFixture<HorseCardComponent>;

    const mockHorse: Horse = {
        id: '1',
        name: 'Spirit',
        birthYear: 2020,
        height: 165,
        sex: Sex.Male,
        healthCertificate: 'cert.pdf'
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HorseCardComponent],
            providers: [provideRouter([])]
        }).compileComponents();

        fixture = TestBed.createComponent(HorseCardComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.componentRef.setInput('horse', mockHorse);
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should display horse name', () => {
        fixture.componentRef.setInput('horse', mockHorse);
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('Spirit');
    });

    it('should display birth year and height', () => {
        fixture.componentRef.setInput('horse', mockHorse);
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('2020');
        expect(compiled.textContent).toContain('165 cm');
    });

    it('should return "Hengst" for male horse', () => {
        fixture.componentRef.setInput('horse', mockHorse);
        fixture.detectChanges();

        expect(component.getSexLabel()).toBe('Hengst');
    });

    it('should return "Merrie" for female horse', () => {
        const femaleHorse = { ...mockHorse, sex: Sex.Female };
        fixture.componentRef.setInput('horse', femaleHorse);
        fixture.detectChanges();

        expect(component.getSexLabel()).toBe('Merrie');
    });

    it('should show certificate icon when health certificate exists', () => {
        fixture.componentRef.setInput('horse', mockHorse);
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.horse-card__certificate')).toBeTruthy();
    });

    it('should not show certificate icon when no certificate', () => {
        const horseWithoutCert = { ...mockHorse, healthCertificate: '' };
        fixture.componentRef.setInput('horse', horseWithoutCert);
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.horse-card__certificate')).toBeNull();
    });

    it('should return correct status class', () => {
        fixture.componentRef.setInput('horse', mockHorse);
        fixture.componentRef.setInput('status', 'Drachtig');
        fixture.detectChanges();

        expect(component.getStatusClass()).toBe('drachtig');
    });

    it('should default status to "Open"', () => {
        fixture.componentRef.setInput('horse', mockHorse);
        fixture.detectChanges();

        expect(component.status()).toBe('Open');
    });
});
