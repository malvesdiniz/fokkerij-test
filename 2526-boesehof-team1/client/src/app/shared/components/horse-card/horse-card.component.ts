import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Horse } from '../../../domain/models/horse.model';
import { Sex } from '../../../domain/enums/sex.enum';

export type BreedingStatus = 'Drachtig' | 'Gedekt' | 'Open';

@Component({
    selector: 'app-horse-card',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
        <a [routerLink]="['/horses', horse().id]" class="horse-card">
            <div class="horse-card__avatar">
                <span class="horse-card__emoji">🐴</span>
            </div>
            <div class="horse-card__content">
                <div class="horse-card__header">
                    <h3 class="horse-card__name">{{ horse().name }}</h3>
                    @if (horse().healthCertificate) {
                        <span class="horse-card__certificate" title="Gezondheidscertificaat">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                            </svg>
                        </span>
                    }
                </div>
                <div class="horse-card__tags">
                    <span class="horse-card__tag horse-card__tag--sex">
                        {{ getSexLabel() }}
                    </span>
                    <span class="horse-card__tag horse-card__tag--status" [class]="'horse-card__tag--' + getStatusClass()">
                        {{ status() }}
                    </span>
                </div>
                <div class="horse-card__meta">
                    Geb. {{ horse().birthYear }} • {{ horse().height }} cm
                </div>
            </div>
            <div class="horse-card__chevron">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m9 18 6-6-6-6"/>
                </svg>
            </div>
        </a>
    `,
    styles: [`
        .horse-card {
            display: flex;
            align-items: center;
            gap: var(--space-4);
            padding: var(--space-4);
            background: var(--bg-primary);
            border-bottom: 1px solid var(--border-light);
            text-decoration: none;
            transition: background var(--transition-fast);
        }

        .horse-card:hover {
            background: var(--bg-secondary);
        }

        .horse-card__avatar {
            width: 56px;
            height: 56px;
            border-radius: var(--radius-full);
            background: linear-gradient(135deg, var(--neutral-100), var(--neutral-200));
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .horse-card__emoji {
            font-size: 1.75rem;
        }

        .horse-card__content {
            flex: 1;
            min-width: 0;
        }

        .horse-card__header {
            display: flex;
            align-items: center;
            gap: var(--space-2);
            margin-bottom: var(--space-1);
        }

        .horse-card__name {
            font-size: var(--font-size-base);
            font-weight: 600;
            color: var(--text-primary);
            margin: 0;
        }

        .horse-card__certificate {
            color: var(--primary-500);
        }

        .horse-card__tags {
            display: flex;
            gap: var(--space-2);
            margin-bottom: var(--space-1);
        }

        .horse-card__tag {
            font-size: var(--font-size-xs);
            font-weight: 500;
            padding: 2px 8px;
            border-radius: var(--radius-full);
        }

        .horse-card__tag--sex {
            background: var(--primary-500);
            color: white;
        }

        .horse-card__tag--status {
            border: 1px solid var(--border-medium);
            color: var(--text-secondary);
        }

        .horse-card__tag--drachtig {
            background: var(--primary-100);
            border-color: var(--primary-500);
            color: var(--primary-700);
        }

        .horse-card__tag--gedekt {
            background: var(--info-light, #e0f2fe);
            border-color: var(--info, #3b82f6);
            color: var(--info, #3b82f6);
        }

        .horse-card__tag--open {
            background: var(--bg-secondary);
            border-color: var(--border-medium);
            color: var(--text-tertiary);
        }

        .horse-card__meta {
            font-size: var(--font-size-sm);
            color: var(--text-tertiary);
        }

        .horse-card__chevron {
            color: var(--text-tertiary);
            flex-shrink: 0;
        }
    `]
})
export class HorseCardComponent {
    readonly horse = input.required<Horse>();
    readonly status = input<BreedingStatus>('Open');

    getSexLabel(): string {
        return this.horse().sex === Sex.Female ? 'Merrie' : 'Hengst';
    }

    getStatusClass(): string {
        return this.status().toLowerCase();
    }
}
