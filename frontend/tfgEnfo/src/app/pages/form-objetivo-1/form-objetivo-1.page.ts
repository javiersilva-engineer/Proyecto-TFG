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

  objetivoPeso: number | null = null;
  peso: number | null = null;
  altura: number | null = null;
  edad: number | null = null;

  triedToNavigate: boolean = false;
  errorMessage: string = '';

  isPC: boolean = false;

  constructor(private router: Router) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.usuario = navigation.extras.state['username'] || '';
    }

    this.isPC = window.innerWidth >= 1024;

    window.addEventListener('resize', () => {
      this.isPC = window.innerWidth >= 1024;
    });
  }

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

  hasError(): boolean {
    return this.objetivoPeso === null ||
      this.peso === null ||
      this.altura === null ||
      this.edad === null;
  }

  goBack() {
    this.router.navigate(['/registro']);
  }
}
