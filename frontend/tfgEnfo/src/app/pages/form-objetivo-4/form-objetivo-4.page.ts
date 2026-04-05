import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-objetivo-4',
  templateUrl: './form-objetivo-4.page.html',
  styleUrls: ['./form-objetivo-4.page.scss'],
  standalone: false
})
export class FormObjetivo4Page implements OnInit {

  usuario: string = '';
  progress: number = 80;

  gestionMenu: 'enfo' | 'manual' | null = null;

  triedToNavigate: boolean = false;
  isPC: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.usuario = navigation.extras.state['username'] || '';
    }

    this.isPC = window.innerWidth >= 767;

    window.addEventListener('resize', () => {
      this.isPC = window.innerWidth >= 767;
    });
  }

  validateAndNavigate() {
    this.triedToNavigate = true;

    if (!this.gestionMenu) return;

    this.router.navigate(['/form-objetivo-5'], {
      state: {
        username: this.usuario,
        gestionMenu: this.gestionMenu
      }
    });
  }

  hasError(): boolean {
    return this.triedToNavigate && !this.gestionMenu;
  }

  goBack() {
    this.router.navigate(['/form-objetivo-3'], {
      state: { username: this.usuario }
    });
  }
}