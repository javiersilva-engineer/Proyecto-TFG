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

  triedToNavigate: boolean = false;
  errorMessage: string = '';

  isPC: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Recuperar username de la navegación (igual que en form-objetivo-1)
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.usuario = navigation.extras.state['username'] || '';
    }

    // Detectar si es PC o no
    this.isPC = window.innerWidth >= 1024;

    window.addEventListener('resize', () => {
      this.isPC = window.innerWidth >= 1024;
    });
  }

  goBack() {
    this.router.navigate(['/form-objetivo-1'], {
      state: { username: this.usuario }
    });
  }

  hasError(): boolean {
    return false; // por ahora no hay campos obligatorios
  }
}
