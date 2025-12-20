import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-objetivo-2',
  templateUrl: './form-objetivo-2.page.html',
  styleUrls: ['./form-objetivo-2.page.scss'],
  standalone: false
})
export class FormObjetivo2Page implements OnInit {

  usuario: string = '';
  progress: number = 40;

  // 👉 selección del fat-button
  nivelActividad: string | null = null;

  triedToNavigate: boolean = false;
  errorMessage: string = '';

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
    this.errorMessage = '';

    if (!this.nivelActividad) {
      this.errorMessage = 'Debes seleccionar una opción';
      return;
    }

    this.router.navigate(['/form-objetivo-3'], {
      state: {
        username: this.usuario,
        actividad: this.nivelActividad
      }
    });
  }

  hasError(): boolean {
    return this.triedToNavigate && !this.nivelActividad;
  }

  goBack() {
    this.router.navigate(['/form-objetivo-1'], {
      state: { username: this.usuario }
    });
  }
}
