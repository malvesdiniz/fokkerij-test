import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css',
})
export class DashboardPageComponent {
  // Dummy data for demonstration purposes.
  // So far the code is only visual,
  // the logic still needs to be applied here
  // the current html and css will need to be broken in components
  stats = {
    totalPaarden: 7,
    drachtigeMerries: 2,
    activeCycli: 4,
    veulensDitJaar: 1,
    jaar: 2024,
  };

  verwachteGeboorten = [
    { naam: 'Bella', datum: '20-5-2025', dagen: -228 },
    { naam: 'Shadow', datum: '5-6-2025', dagen: -212 },
  ];

  lopendeDekkingen = [
    { naam: 'Luna', status: 'Wacht op drachtigheidsonderzoek', dagen: 417 },
    { naam: 'Daisy', status: 'In dekfase', dagen: 398 },
  ];
}
