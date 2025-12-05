import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-objetivo-1',
  templateUrl: './form-objetivo-1.page.html',
  styleUrls: ['./form-objetivo-1.page.scss'],
  standalone: false
})
export class FormObjetivo1Page implements OnInit {

  usuario: string = '';
  progress: number = 20;

  // Valores elegidos en los pickers
  objetivoPeso: number | null = null;
  peso: number | null = null;
  altura: number | null = null;
  edad: number | null = null;

  // Flag para saber si el usuario intentó avanzar
  triedToNavigate: boolean = false;

  // Mensaje de error general
  errorMessage: string = '';

  constructor(private router: Router) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.usuario = navigation.extras.state['username'] || '';
    }
  }

  // Validar campos y navegar a la siguiente página
  validateAndNavigate() {
    this.triedToNavigate = true;
    this.errorMessage = '';

    const pickers = [
      { value: this.objetivoPeso, label: 'objetivoPeso' },
      { value: this.peso, label: 'peso' },
      { value: this.altura, label: 'altura' },
      { value: this.edad, label: 'edad' },
    ];

    const hasError = pickers.some(p => p.value === null);

    if (hasError) {
      return;
    }

    this.router.navigate(['/siguiente-pagina']);
  }

  goBack() {
    this.router.navigate(['/registro']);
  }
}