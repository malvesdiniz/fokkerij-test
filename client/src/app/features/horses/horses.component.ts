import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HorseService } from '../../core/services/horse.service';
import { HorseCardComponent, BreedingStatus } from '../../shared/components/horse-card/horse-card.component';
import { Horse } from '../../domain/models/horse.model';
import { Sex } from '../../domain/enums/sex.enum';

type FilterTab = 'all' | 'mares' | 'stallions';

@Component({
    selector: 'app-horses',
    standalone: true,
    imports: [CommonModule, RouterLink, HorseCardComponent],
    template: `
        <div class="page">
            <header class="header header--with-action">
                <h1 class="header__title">Paarden</h1>
                <a routerLink="/horses/add" class="header__action-btn" aria-label="Nieuw paard toevoegen">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                </a>
            </header>

            <div class="filter-tabs">
                <button 
                    class="filter-tab"
                    [class.filter-tab--active]="activeFilter() === 'all'"
                    (click)="setFilter('all')"
                >
                    Alles ({{ horses().length }})
                </button>
                <button 
                    class="filter-tab"
                    [class.filter-tab--active]="activeFilter() === 'mares'"
                    (click)="setFilter('mares')"
                >
                    Merries ({{ maresCount() }})
                </button>
                <button 
                    class="filter-tab"
                    [class.filter-tab--active]="activeFilter() === 'stallions'"
                    (click)="setFilter('stallions')"
                >
                    Hengsten ({{ stallionsCount() }})
                </button>
            </div>

            <main class="horse-list">
                @if (isLoading()) {
                    <div class="loading-state">
                        <div class="loading-spinner"></div>
                        <p>Paarden laden...</p>
                    </div>
                } @else if (error()) {
                    <div class="error-state">
                        <p>{{ error() }}</p>
                        <button class="btn btn--secondary" (click)="loadHorses()">Opnieuw proberen</button>
                    </div>
                } @else if (filteredHorses().length === 0) {
                    <div class="empty-state">
                        <div class="empty-state__icon">🐴</div>
                        <h3>Geen paarden gevonden</h3>
                        <p>Voeg je eerste paard toe om te beginnen.</p>
                        <a routerLink="/horses/add" class="btn btn--primary">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="5" x2="12" y2="19"/>
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                            Paard toevoegen
                        </a>
                    </div>
                } @else {
                    @for (horse of filteredHorses(); track horse.id) {
                        <app-horse-card 
                            [horse]="horse" 
                            [status]="getBreedingStatus(horse)"
                        />
                    }
                }
            </main>
        </div>
    `,
    styles: [`
        .header--with-action {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .header__action-btn {
            width: 40px;
            height: 40px;
            border-radius: var(--radius-lg);
            background: var(--primary-500);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: var(--shadow-md);
            transition: all var(--transition-fast);
        }

        .header__action-btn:hover {
            background: var(--primary-600);
            transform: scale(1.05);
        }

        .filter-tabs {
            display: flex;
            gap: var(--space-2);
            padding: var(--space-3) var(--space-4);
            background: var(--bg-secondary);
            overflow-x: auto;
        }

        .filter-tab {
            padding: var(--space-2) var(--space-4);
            border-radius: var(--radius-full);
            font-size: var(--font-size-sm);
            font-weight: 500;
            color: var(--text-secondary);
            background: transparent;
            border: none;
            cursor: pointer;
            white-space: nowrap;
            transition: all var(--transition-fast);
        }

        .filter-tab:hover {
            background: var(--bg-tertiary);
        }

        .filter-tab--active {
            background: var(--bg-primary);
            color: var(--text-primary);
            box-shadow: var(--shadow-sm);
        }

        .horse-list {
            flex: 1;
            overflow-y: auto;
        }

        .loading-state,
        .error-state,
        .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: var(--space-12);
            text-align: center;
            gap: var(--space-4);
        }

        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--border-light);
            border-top-color: var(--primary-500);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .empty-state__icon {
            font-size: 4rem;
            margin-bottom: var(--space-2);
        }

        .empty-state h3 {
            margin: 0;
        }

        .empty-state p {
            margin: 0;
            color: var(--text-tertiary);
        }

        .error-state {
            color: var(--error);
        }
    `]
})
export class HorsesComponent {
    private readonly horseService = inject(HorseService);

    readonly horses = signal<Horse[]>([]);
    readonly isLoading = signal(true);
    readonly error = signal<string | null>(null);
    readonly activeFilter = signal<FilterTab>('all');

    readonly maresCount = computed(() =>
        this.horses().filter(h => h.sex === Sex.Female).length
    );

    readonly stallionsCount = computed(() =>
        this.horses().filter(h => h.sex === Sex.Male).length
    );

    readonly filteredHorses = computed(() => {
        const filter = this.activeFilter();
        const allHorses = this.horses();

        switch (filter) {
            case 'mares':
                return allHorses.filter(h => h.sex === Sex.Female);
            case 'stallions':
                return allHorses.filter(h => h.sex === Sex.Male);
            default:
                return allHorses;
        }
    });

    constructor() {
        this.loadHorses();
    }

    loadHorses(): void {
        this.isLoading.set(true);
        this.error.set(null);

        this.horseService.getAllHorses().subscribe({
            next: (horses) => {
                this.horses.set(horses);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Error loading horses:', err);
                this.error.set('Kon paarden niet laden. Controleer je internetverbinding.');
                this.isLoading.set(false);
            }
        });
    }

    setFilter(filter: FilterTab): void {
        this.activeFilter.set(filter);
    }

    getBreedingStatus(horse: Horse): BreedingStatus {
        const statuses: BreedingStatus[] = ['Drachtig', 'Gedekt', 'Open'];
        const index = horse.name.charCodeAt(0) % 3;
        return statuses[index];
    }
}
