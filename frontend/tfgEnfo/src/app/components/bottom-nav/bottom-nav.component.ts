import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class BottomNavComponent {
  @Input() active: 'progreso' | 'recetas' | 'add' | 'comidas' | 'perfil' = 'progreso';

  constructor(private router: Router) { }

  navigateTo(section: 'progreso' | 'recetas' | 'add' | 'comidas' | 'perfil') {
    switch (section) {
      case 'progreso':
        this.router.navigate(['/home']);
        break;
      case 'recetas':
        this.router.navigate(['/recetas']);
        break;
      case 'add':
        this.router.navigate(['/add-comida']);
        break;
      case 'comidas':
        this.router.navigate(['/comidas-1']);
        break;
      case 'perfil':
        this.router.navigate(['/mi-perfil']);
        break;
    }
  }
}