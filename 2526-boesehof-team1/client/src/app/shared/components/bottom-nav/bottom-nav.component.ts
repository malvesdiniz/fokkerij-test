import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.css',
})
export class BottomNavComponent {
  readonly navItems: NavItem[] = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
    },
    {
      path: '/horses',
      label: 'Paarden',
      icon: 'horse',
    },
    {
      path: '/breeding',
      label: 'Dekking',
      icon: 'breeding',
    },
    {
      path: '/journal',
      label: 'Dagboek',
      icon: 'journal',
    },
  ];
}
